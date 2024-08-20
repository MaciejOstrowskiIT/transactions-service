import amqplib from 'amqplib';

export async function sendEvent(channel: amqplib.Channel, exchange: string, payload: any) {
  await channel.assertExchange(exchange, 'fanout', { durable: true });
  channel.publish(exchange, '', Buffer.from(JSON.stringify(payload)));
  console.log('Event sent:', payload);
}