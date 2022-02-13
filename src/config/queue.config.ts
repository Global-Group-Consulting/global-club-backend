import {registerAs} from "@nestjs/config";
import {LaravelQueueConfig} from "../queue/LaravelQueue";
import * as fs from "fs";

function ssl(): any {
  if (process.env.QUEUE_SSL_CERT) {
    return {
      rejectUnauthorized: true,
      ca: fs.readFileSync(__dirname + '/../../' + process.env.QUEUE_SSL_CERT),
    }
  }
  
  return null
}

export default registerAs("queue", () => ({
  db: {
    host: process.env.QUEUE_HOST,
    port: +process.env.QUEUE_PORT ?? null,
    user: process.env.QUEUE_USER,
    password: process.env.QUEUE_PASSWORD,
    database: process.env.QUEUE_DATABASE,
    ssl: ssl()
    // ssl: {
    // rejectUnauthorized: true,
    // ca: fs.readFileSync(__dirname + '/../../db-ca-certificate.crt'),
    // }
  },
  queueName: process.env.QUEUE_NAME
} as LaravelQueueConfig))
