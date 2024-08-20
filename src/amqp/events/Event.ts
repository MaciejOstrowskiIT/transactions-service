import amqplib, { Channel } from 'amqplib';
import Joi from 'joi';

export class Event<T> {
    constructor(
        private timestamp: string,
        private payload: Record<string, unknown>,
        private schema: Joi.ObjectSchema<T>
    ){}


    //to powinno byc otypowane
    create() {
        if(!this.schema.validate(this.payload)) {
            throw new Error('Wrong payload')
        }
        return {
            timestamp: this.timestamp,
            payload: this.payload
        }
    }

    // typeguards https://www.typescriptlang.org/docs/handbook/advanced-types.html
}