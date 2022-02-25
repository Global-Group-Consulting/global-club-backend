import {createConnection, Connection, escape as mySqlEscape, ConnectionConfig} from 'mysql';
import {now, random} from "lodash";
import {serialize, Class} from 'php-serialization'

export type AvailableJobNames = "SendEmail" | "TriggerRepayment" | "TriggerBriteRecapitalization";

export class AvailableJob {
  id: number;
  title: string;
  description: string;
  class: string;
  queueName: string;
  payloadValidation: string;
  payloadKey: string;
  created_at: Date;
  updated_at: Date;
  // Added in JS
  name: string;
}

export class LaravelJob {
  queue: string;
  payload: string;
  attempts: number;
  available_at: number;
  created_at: number;
}

export class QueueOptions {
  "maxTries": number;
  "maxExceptions": number;
  "failOnTimeout": boolean;
  "backoff": number;
  "timeout": number;
  "retryUntil": number;
}

export class JobOptions {
  job?: string;
  connection?: string;
  queue?: string;
  chainConnection?: string;
  chainQueue?: string;
  delay?: number;
}

export interface LaravelQueueConfig {
  db: ConnectionConfig,
  queueName: string;
}

export class LaravelQueue {
  private readonly mySqlConnection: Connection;
  private readonly connectionReady;
  private availableJobs: AvailableJob[];
  private config: LaravelQueueConfig;
  
  constructor(config: LaravelQueueConfig) {
    this.config = config;
    
    this.mySqlConnection = createConnection(config.db)
    
    this.connectionReady = new Promise((resolve, reject) => {
      this.mySqlConnection.connect((err) => {
        if (err) {
          reject();
          throw err
        }
        
        console.log("[LARAVEL_QUE] - Module ready!")
        
        this.fetchAvailableJobs().then(() => {
          console.log("[LARAVEL_QUE] - Available jobs fetched!")
          resolve(true);
        });
      });
    });
  }
  
  async query<T>(sql: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.mySqlConnection.query(sql, function (err, result) {
        if (err) {
          return reject(err);
        }
        
        resolve(result)
      });
    })
  }
  
  async fetchAvailableJobs() {
    const sql = `SELECT *
                 FROM job_lists`;
    
    const result = await this.query<AvailableJob[]>(sql);
    
    this.availableJobs = result.map(el => {
      return {
        ...el,
        name: el.class.slice(el.class.lastIndexOf("\\") + 1)
      }
    });
  }
  
  async getJob(job: string): Promise<AvailableJob> {
    const result = this.availableJobs.find(el => el.name === job);
    
    if (!result) {
      return Promise.reject("Unknown job: " + job);
    }
    
    return Promise.resolve(result)
  }
  
  async pushTo(jobName: AvailableJobNames, payload?: any, options?: JobOptions) {
    await this.connectionReady;
  
    const encodedPayload = new Buffer(JSON.stringify(payload)).toString('base64');
    const job = await this.getJob(jobName);
    const data = this.prepareData(job, encodedPayload, options);
  
    const sql = `INSERT INTO jobs (queue, payload, attempts, available_at, created_at)
                 VALUES ('${data.queue}',
                         ${mySqlEscape(data.payload)},
                         ${data.attempts},
                         ${data.available_at},
                         ${data.created_at})`;
  
    return await this.query(sql);
  
    // console.log(data.payload);
  }
  
  private prepareData(reqJob: AvailableJob, payload?: any, options?: JobOptions): LaravelJob {
    const mainObj = {
      "uuid": this.generateUUID(),
      "displayName": reqJob.class,
      "job": "Illuminate\\Queue\\CallQueuedHandler@call",
      "maxTries": null,
      "maxExceptions": null,
      "failOnTimeout": false,
      "backoff": null,
      "timeout": null,
      "retryUntil": null,
      "data": {
        commandName: reqJob.class,
        command: ""
      }
    }
    const commandObj = {
      [reqJob.payloadKey]: payload ?? {},
      "job": null,
      "connection": null,
      "queue": options?.queue || reqJob.queueName || null,
      "chainConnection": null,
      "chainQueue": null,
      "chainCatchCallbacks": null,
      "delay": null,
      "afterCommit": null,
      "middleware": [],
      "chained": [],
    }
    const job = new Class(reqJob.class);
    
    this.prepareForSerialization(commandObj, job, [reqJob.payloadKey], reqJob.class);
    
    mainObj.data.command = serialize(job, "object");
    
    return {
      queue: options?.queue || reqJob.queueName || "default",
      payload: JSON.stringify(mainObj),
      attempts: 0,
      available_at: Math.floor(Date.now() / 1000),
      created_at: Math.floor(Date.now() / 1000)
    };
  }
  
  private prepareForSerialization(data: any, container: Class, privateKeys: string[], className?: string) {
    Object.keys(data).forEach(key => {
      let value = data[key];
      let type = "string";
      
      if (value && value instanceof Array) {
        type = "array";
        value = new Class("")
        
        this.prepareForSerializationArray(data[key], value);
      } else if (value && value.constructor.name === "Object") {
        type = "array";
        value = new Class("")
        
        this.prepareForSerialization(data[key], value, privateKeys)
      } else if (!value) {
        type = "null"
      } else if (typeof value === "number") {
        type = "float"
      }
      
      container.__addAttr__(key, "string", value, type, privateKeys.includes(key) ? "protected" : null);
    })
  }
  
  private prepareForSerializationArray(data: any[], container: Class) {
    data.forEach((el, index) => {
      let type = "string";
      let value = el;
      
      if (el && el.constructor.name === "Object") {
        type = "array";
        value = new Class("")
        
        this.prepareForSerialization(el, value, []);
      } else if (typeof el === "number") {
        type = "float"
      }
      
      container.__addAttr__(index, "integer", value, type);
    })
  }
  
  private generateUUID() {
    let d = now();
    
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + random(16)) % 16 | 0;
      
      d = Math.floor(d / 16);
      
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  };
}

/*

const queue = new LaravelQueue()

queue.pushTo("SendEmail", {
  firstName: "Mario",
  lastname: "Rossi",
  test: [
    "pipp", "pluto",
    {
      "oggetto": 11231231232
    }
  ]
}, {
  queue: "club.staging"
});
*/
