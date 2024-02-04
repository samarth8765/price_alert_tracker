import { connect } from 'amqplib';

export async function publishEmailTask(emailData) {
    const conn = await connect('amqp://localhost');
    const channel = await conn.createChannel();
    const queue = 'emailTasks';

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), { persistent: true });

    console.log('Published email task:', emailData);
    await channel.close();
    await conn.close();
}
