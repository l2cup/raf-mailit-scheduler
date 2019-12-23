const amqp = require('amqplib');


async function sendToQueue(data) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'mailerQueue';

    channel.assertQueue(queue, { durable: true });

    await Promise.all(
      data.map((message) => channel.sendToQueue(queue,
        Buffer.from(JSON.stringify(message)),
        { persistent: true })),
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = { sendToQueue };
