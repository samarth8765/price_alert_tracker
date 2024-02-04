import { connect } from 'amqplib';
import { createTransport } from 'nodemailer';
import 'dotenv/config';
console.log(parseInt(process.env.EMAIL_PORT));
const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    }
});

async function sendEmail(emailData) {
    if (!emailData.to) {
        console.error("Missing recipient in email data:", emailData);
        return;
    }
    const { to, subject, body } = emailData;
    await transporter.sendMail({
        from: `${process.env.EMAIL}`,
        to: to,
        subject: subject,
        text: body,
    });

    console.log(`Email sent to ${to}`);
}

export async function startEmailConsumer() {
    try {
        const conn = await connect('amqp://rabbitmq');
        const channel = await conn.createChannel();

        const queue = 'emailTasks';
        await channel.assertQueue(queue, { durable: true });

        console.log("Email Consumer is running. Waiting for email tasks...");

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const emailData = JSON.parse(msg.content.toString());
                try {
                    await sendEmail(emailData);
                    channel.ack(msg);
                } catch (error) {
                    console.error("Failed to send email:", error);
                }
            }
        }, { noAck: false });
    } catch (error) {
        console.error("Failed to start email consumer:", error);
    }
}



