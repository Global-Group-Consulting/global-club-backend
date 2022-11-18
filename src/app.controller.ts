import {Controller, Get, Inject} from '@nestjs/common';
import { AppService } from './app.service';
import {QueueService} from "./queue/queue.service";

@Controller()
export class AppController {
  constructor (private readonly appService: AppService,
               @Inject("LARAVEL_QUEUE") private queue: QueueService,) {}
  
  @Get()
  async getHello(): Promise<string> {
    /*await this.queue.queue.pushTo("TriggerBriteRecapitalization", {
      userId: "5fa685ff6a42ef0021c799ca",
      amount: 111,
      notes: "non è una verà nota ma contiene caratteri !!?^? speciali!!",
      amountEuro: 111
    });*/
    
    return this.appService.getHello();
  }
}
