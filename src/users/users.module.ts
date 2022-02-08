import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import {OrdersModule} from "../orders/orders.module";
import {AxiosModule} from "../axios/axios.module";
import {UsersOrderEventsListeners} from "./listeners/users.orderEvents.listeners";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ], "legacy"),
    AxiosModule,
    OrdersModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersOrderEventsListeners]
})
export class UsersModule {}
