import {validateMessage} from '../amqp/validators/validateMessage';
import {updateDatabase} from '../amqp/database/updateDatabase';
import {sendEvent} from '../amqp/events/sendEvent';
import {logger} from '../utils/logs';
import { Channel } from 'amqplib';
import Joi from 'joi';


export class Handler<T> {
    private messagePayload: T = {} as T;
    constructor(private channel: Channel, private queueName: string, private schema: Joi.ObjectSchema<T> ) {    
    }


    async listen() {
        await this.channel.consume(this.queueName, async (msg) => {
            console.log('handler', msg?.content)
            if (msg?.content) {
              try {
                const content = JSON.parse(msg.content.toString());
                console.log('CONTENT', content)
                const isValid = this.schema.validate(content);
                if (!isValid) {
                    const error = `Invalid message received: ${content}`
                  logger('error', error);
                  throw new Error(error);
                }
                this.messagePayload = content as T;
              } catch (err) {
                logger('error', 'Error processing message:' + err);
                this.channel.nack(msg, false, false);
              }
            }
          }, { noAck: false });
    }

    getPayload():T {
        return this.messagePayload;
    }
}