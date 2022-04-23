import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {CommunicationsService} from './communications.service';
import {CommunicationsController} from './communications.controller';
import {Communication, CommunicationsSchema} from "./schemas/communications.schema";
import {FilesModule} from "../files/files.module";
import { CommunicationEventsListeners } from './listeners/communicationEvents.listeners'
import { Order, OrdersSchema } from '../orders/schemas/order.schema'
import { UsersModule } from '../users/users.module'
import { User, UserSchema } from '../users/schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Communication.name,
        schema: CommunicationsSchema
      },
      {
        name: Order.name,
        schema: OrdersSchema
      },
    ], "club"),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ], "legacy"),
    FilesModule,
  ],
  controllers: [CommunicationsController],
  providers: [CommunicationsService, CommunicationEventsListeners],
  exports: [CommunicationsService]
})
export class CommunicationsModule {
}
