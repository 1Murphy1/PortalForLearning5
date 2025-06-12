import amqp from 'amqplib';

let channel: amqp.Channel;
export async function getChannel() {
    if (channel) return channel;
    const conn = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await conn.createChannel();
    await channel.assertQueue('enroll_queue', { durable: true });
    return channel;
}

export async function publishEnroll(msg: { enrollmentId: string; userId: string; courseId: string; }) {
    const ch = await getChannel();
    ch.sendToQueue('enroll_queue', Buffer.from(JSON.stringify(msg)), { persistent: true });
}

export async function consumeEnroll(handler: (msg: { enrollmentId: string; userId: string; courseId: string; }) => Promise<void>) {
    const ch = await getChannel();
    ch.consume('enroll_queue', async m => {
        if (!m) return;
        const data = JSON.parse(m.content.toString());
        await handler(data);
        ch.ack(m);
    });
}