import {Module, Scope} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ProductsModule} from './products/products.module';
import {UsersModule} from './users/users.module';
import {CommunicationsModule} from './communications/communications.module';
import {MovementsModule} from './movements/movements.module';
import {AxiosModule} from './axios/axios.module';
import {FilesModule} from './files/files.module';
import {OrdersModule} from './orders/orders.module';
import {ProductCategoryModule} from './product-category/product-category.module';
import {SystemLogsModule} from './system-logs/system-logs.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {AclModule} from './acl/acl.module';
import {PacksModule} from './packs/packs.module';
import {QueueModule} from './queue/queue.module';
import databaseConfig from './config/db.config';
import httpConfig from './config/http.config';
import queueConfig from "./config/queue.config";
import {I18nJsonParser, I18nModule} from "nestjs-i18n";
import {join} from "path";
import { FinderModule } from './finder/finder.module';

@Module({
  imports: [
    // Loads globally the config module
    ConfigModule.forRoot({
      envFilePath: `.env`, isGlobal: true,
      load: [databaseConfig, httpConfig, queueConfig]
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    
    // using async to import db config
    MongooseModule.forRootAsync({
      connectionName: "legacy",
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_LEGACY_CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      connectionName: "club",
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_CLUB_CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
    
    I18nModule.forRoot({
      fallbackLanguage: 'it',
      parser: I18nJsonParser,
      parserOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
   
    CommunicationsModule,
    DashboardModule,
    MovementsModule,
    OrdersModule,
    ProductsModule,
    ProductCategoryModule,
    UsersModule,
    AxiosModule,
    FilesModule,
    AclModule,
    PacksModule,
    QueueModule,
    SystemLogsModule,
    FinderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
