import {Injectable, Logger} from '@nestjs/common';
import {AvailableJobNames, LaravelQueue, LaravelQueueConfig} from "./LaravelQueue";
import {SendEmailDto} from "./dto/send-email.dto";

@Injectable()
export class QueueService {
  private queue: LaravelQueue;
  private logger: Logger;
  
  constructor(config: LaravelQueueConfig) {
    this.queue = new LaravelQueue(config);
    this.logger = new Logger("LaravelQueue")
  }
  
  dispatchEmail(payload: SendEmailDto) {
    return this.queue.pushTo("SendEmail", payload);
  }
  
  /*dispatch(jobName: AvailableJobNames, payload: any) {
    return this.queue.pushTo(jobName, payload);
  }*/
}
