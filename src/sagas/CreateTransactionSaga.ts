//https://www.theserverside.com/tutorial/How-the-saga-design-pattern-in-microservices-works

import { Channel, ConsumeMessage } from "amqplib";
import Joi from 'joi'
import { logger } from "../utils/logs";
// Proces tworzenia transakcji
// 1. Request z frontu to gateway'a 
// 2. Gateway wysyla message na kolejke "CreateTransaction"
// 3. Message jest konsumowany przez CreateTransactionHandler w transactions-service
// 4. W trakcie konsumpcji dodajemy do bazy danych transactions nasza transakcje
// 5. Wysylamy event TransactionCreated 
// 6. Tego eventu nasluchuje nasza Saga
// 7. Saga konsumuje event TransactionCreated
// 8. Saga wysyla message AdjustRecipientBalance
// 9. Ten message odbiera handler w users-service (docelowo cudnie byloby miec accounts-microservice)
// 10. Handler obsluguje message i wysyla event RecipientBalanceAdjusted
// 11. Saga przechwytuje event i na jego podstawie wysyla message ReduceSenderBalance
// 12. Ten message odbiera handler w users-service 
// 13. Handler wykonuje update na bazie i wysyla event SenderBalanceReduced
// 14. Saga odbiera ten event i wysyla event CreateTransactionCompleted (jak wymyslisz lepsza nazwe to moze byc inna)
// 15. Tego eventu nasluchuje gateway i jak go otrzyma to zwraca response do frontu*
//      - gateway musi byc w stanie wstrzymania po wyslaniu pierwszego message'a 
//      - chodzi o to, ze musisz w jakis sposob wysylac i od razu po tym nasluchiwac czy wraca jakis event, moze tu pomoc RxJS


type ConsumableMessageSchema = {
    name: string,
    schema: Joi.ObjectSchema<unknown>
}

enum SagaStatus  {
    'ACTIVE',
    'CLOSED',
    'ERROR',
    'PENDING'
}


/*
Saga musi odpalac listen (czyli nasluchiwanie docelowych wiadomosci) dopiero gdy trafi do niej wiadomosc startujaca
Trzeba poszukac opcji czy mozna gdzeis dac w consume wiadomosci, ktore ma konsumowac, jakis warunek filtruyjacy
Poczytaj czym w ogole jest Saga, ale nie skupiaj sie, zeby to bylo wytlumaczenie JSowe!

stosujmy nazewnictwo dla message'y i eventow takie:
events.ACCOUNT_CLOSED
messages.CREATE_ACCOUNT
*/

export class Saga {
    protected status:SagaStatus = SagaStatus.PENDING
    private messagesPayloads: Record<string, unknown>[] = [] as Record<string, unknown>[]
    constructor(private channel: Channel, private queueName: string, private messages: ConsumableMessageSchema[], private startingMessage: string, endingMessage: string) {    
    }


    async listen() {
        await this.channel.consume(this.queueName, async (msg) => {

            if (msg) {
              try {
                const content = this.isMessageConsumable(msg)
                this.messagesPayloads.push(content);
              } catch (err) {
                logger('error', 'Error processing message:' + err);
                this.channel.nack(msg, false, false);
              }
            }
          }, { noAck: false });
    }

    private isMessageConsumable(msg: ConsumeMessage) {
        if(msg?.content) {
            const content = JSON.parse(msg.content.toString());
            const message = this.messages.find((message) => message.name === content.name)
            if(message)   {
                const isValid = message.schema.validate(content);
                if (!isValid) {
                    const error = `Invalid message received: ${content}`
                  logger('error', error);
                  throw new Error(error);
                }
                return content;
            }
        }
        throw new Error('Message payload is wrong')

    }

    getPayload():Record<string, unknown>[] {
        return this.messagesPayloads;
    }

    private shouldSagaStart(name: string) {
        if(name === this.startingMessage) {
            this.status = SagaStatus.ACTIVE;
        }

    }
}