import { connect } from 'amqplib';
import { createTransport } from 'nodemailer';

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'michel.hane@ethereal.email',
        pass: 'rH2X4R2pxyWMNdV6PQ'
    }
});

async function sendEmail(emailData) {
    if (!emailData.to) {
        console.error("Missing recipient in email data:", emailData);
        return;
    }
    const { to, subject, body } = emailData;
    await transporter.sendMail({
        from: '"Michel" <michel.hane@ethereal.email>',
        to: to,
        subject: subject,
        text: body,
    });

    console.log(`Email sent to ${to}`);
}

async function startEmailConsumer() {
    try {
        const conn = await connect('amqp://localhost');
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

startEmailConsumer();

