import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule, ConfigService} from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CommunicationsModule } from './communications/communications.module';
import { MovementsModule } from './movements/movements.module';
import { AxiosModule } from './axios/axios.module';
import { FilesModule } from './files/files.module';
import { OrdersModule } from './orders/orders.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { SystemLogsModule } from './system-logs/system-logs.module';
import databaseConfig from './config/db.config';
import httpConfig from './config/http.config';

@Module({
  imports: [
    // Loads globally the config module
    ConfigModule.forRoot({
      envFilePath: `.env`, isGlobal: true,
      load: [databaseConfig, httpConfig]
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
    
    // Custom Modules
    CommunicationsModule,
    OrdersModule,
    ProductsModule,
    ProductCategoryModule,
    MovementsModule,
    UsersModule,
    AxiosModule,
    FilesModule,
    SystemLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
