import {validateMessage} from '../amqp/validators/validateMessage';
import {updateDatabase} from '../amqp/database/updateDatabase';
import {sendEvent} from '../amqp/events/sendEvent';
import {logger} from '../utils/logs';
import { Channel } from 'amqplib';
import { Handler } from './Handler';
import { schema } from '../amqp/validators/validateEventExample';

type ExampleMsgType = {
    name: string
}

export class CreateTransactionHandler extends Handler<ExampleMsgType>{
    
    constructor(channel: Channel) {
        const queueName = 'create-transactions';
        super(channel, queueName, schema);
        this.listen();
    }

    async handleMessage() {
        const payload = this.getPayload()
        console.log(payload)
    }


  
}