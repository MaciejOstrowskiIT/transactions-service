import amqplib from 'amqplib';
import { logger } from '../utils/logs';

export interface Exchange {
    name: string;
    queues: string[];
}

export class AMQP {
    public channel!: amqplib.Channel;
    constructor(private exchanges: Exchange[]) {}

    public async config() {
        try {
            await this.connect();
            await this.assertExchangesAndQueues();
            await this.bindQueues();
        } catch (err) {
            logger('error', `Error configuring channelAMQP: ${err}`);
            throw new Error(err as string);
        }
    }

    private async connect() {
        return new Promise<void>((resolve, reject) => {
            let counter = 0;
            const maximum = 5;
            let error: Error | string;
            const interval = setInterval(async () => {
                if (counter === maximum) {
                    clearInterval(interval);
                    reject(new Error('Timeout'));
                    return;
                }
                try {
                    const connection = await amqplib.connect(process.env.AMQP!);
                    clearInterval(interval);
                    logger('success', 'Connected to AMQP');
                    const channel = await connection.createChannel();
                    this.channel = channel;
                    resolve();
                } catch (err) {
                    console.log(err)
                    counter++;
                    logger('info', 'Retrying connecting to AMQP');
                    error = err as string;
                }
            }, 2000);
        });
    }

    private async assertExchangesAndQueues() {
        for (const exchange of this.exchanges) {
            await this.channel.assertExchange(exchange.name, 'fanout', {
                durable: false,
            });
            exchange.queues.forEach(async (queue) => {
                await this.channel.assertQueue(queue);
            });
        }
    }

    private async bindQueues() {
        for (const exchange of this.exchanges) {
            exchange.queues.forEach(async (queue) => await this.channel.bindQueue(queue, exchange.name, ''));
        }
    }

    public send(exchange: string, routingKey: string, payload: unknown) {
        this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(payload)));
    }
}
