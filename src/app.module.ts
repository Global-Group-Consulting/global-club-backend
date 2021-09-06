import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule, ConfigService} from '@nestjs/config';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ProductsModule} from './products/products.module';
import {UsersModule} from './users/users.module';
import {CommunicationsModule} from './communications/communications.module';
import {MovementsModule} from './movements/movements.module';
import databaseConfig from './config/db.config';
import {AuthMiddleware} from "./auth.middleware";

@Module({
  imports: [
    // Loads globally the config module
    ConfigModule.forRoot({
      envFilePath: `.env`, isGlobal: true,
      load: [databaseConfig]
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
    MovementsModule,
    ProductsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  /*configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }*/
}
