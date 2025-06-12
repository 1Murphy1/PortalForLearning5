import amqp from 'amqplib';

const RABBIT_URL = process.env.RABBITMQ_URL!;
const MAX_ATTEMPTS = 10;
const BASE_DELAY_MS = 2000; // 2 seconds

interface EnrollmentMessage {
    enrollmentId: string;
    userId: string;
    courseId: string;
}

/**
 * Attempts to connect to RabbitMQ with exponential backoff.
 * @param attempt Current attempt number
 */
async function connectWithRetry(attempt: number = 1): Promise<amqp.Channel> {
    try {
        const conn = await amqp.connect(RABBIT_URL);
        const ch = await conn.createChannel();
        return ch;
    } catch (err) {
        if (attempt >= MAX_ATTEMPTS) {
            console.error(`RabbitMQ connection failed after ${attempt} attempts`, err);
            throw err;
        }
        const delay = Math.min(BASE_DELAY_MS * 2 ** (attempt - 1), 30000);
        console.warn(
            `RabbitMQ connection attempt ${attempt} failed. Retrying in ${delay / 1000}s...`
        );
        await new Promise(res => setTimeout(res, delay));
        return connectWithRetry(attempt + 1);
    }
}

/**
 * Returns an open channel to RabbitMQ, retrying until successful.
 */
export async function getChannel(): Promise<amqp.Channel> {
    return connectWithRetry();
}

/**
 * Publishes a message to the specified queue (durable & persistent).
 * @param queueName Name of the RabbitMQ queue
 * @param message Any JSON-serializable object
 */
export async function publishToQueue(queueName: string, message: EnrollmentMessage) {
    const ch = await getChannel();
    await ch.assertQueue(queueName, { durable: true });
    ch.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    await ch.close();
}
