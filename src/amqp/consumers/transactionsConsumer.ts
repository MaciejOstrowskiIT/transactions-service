import { Channel } from 'amqplib';
import { validateMessage } from '../validators/validateMessage';
import { updateDatabase } from '../database/updateDatabase';
import { sendEvent } from '../events/sendEvent';
import {logger} from '../../utils/logs';
import { Event } from '../events/Event';


export const transactionsConsumer = async (channel: Channel) => {
  const queueName = 'create-transactions';

  channel.consume(queueName, async (msg) => {
    if (msg?.content) {
      try {
        const content = JSON.parse(msg.content.toString());

        const isValid = validateMessage(content);
        if (!isValid) {
          logger('error', 'Invalid message received:' + content);
          channel.nack(msg, false, false);
          return;
        }

        const updateResult = await updateDatabase(content);
        if (!updateResult) {
          logger('error', 'Failed to update database with message:' + content);
          channel.nack(msg, false, false);
          return;
        }

        const eventPayload = {
          status: 'success',
          transactionId: content.transactionId,
          timestamp: new Date(),
        };
 

        await sendEvent(channel, 'transaction-events', eventPayload);

        channel.ack(msg);
      } catch (err) {
        logger('error', 'Error processing message:' + err);
        channel.nack(msg, false, false);
      }
    }
  }, { noAck: false });
}
