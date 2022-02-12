import {DynamicModule, Global, Module, Provider} from '@nestjs/common';
import {QueueService} from './queue.service';
import {ConfigService} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";
import {getSharedConfigToken} from "@nestjs/bull";

export const LARAVEL_QUEUE = 'LARAVEL_QUEUE';

export const queueProviderFactory = {
  provide: 'LARAVEL_QUEUE',
  useFactory: (configService: ConfigService) => {
    const options = configService.get("queue");
    return new QueueService(options);
  },
  inject: [ConfigService]
};

@Global()
@Module({
  imports: [ConfigService],
  providers: [queueProviderFactory],
  exports: [LARAVEL_QUEUE]
})
export class QueueModule {

}
