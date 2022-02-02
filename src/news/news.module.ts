import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { ClientProxyFactory, ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [NewsController],
  providers: [NewsService, {
    provide: 'NEWS_MICROSERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: configService.get('NEWS_SERVICE_HOST'),
          port: configService.get('NEWS_SERVICE_PORT'),
        },
      }),
  }]
})
export class NewsModule {}
