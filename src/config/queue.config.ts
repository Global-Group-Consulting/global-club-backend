import {registerAs} from "@nestjs/config";
import {LaravelQueueConfig} from "../queue/LaravelQueue";

export default registerAs("queue", () => ({
  db: {
    host: process.env.QUEUE_HOST,
    user: process.env.QUEUE_USER,
    password: process.env.QUEUE_PASSWORD,
    database: process.env.QUEUE_DATABASE
  },
  queueName: process.env.QUEUE_NAME
} as LaravelQueueConfig))
