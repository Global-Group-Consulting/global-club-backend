import {Module} from '@nestjs/common';
import {OrdersService} from './orders.service';
import {OrdersController} from './orders.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Order, OrdersSchema} from "./schemas/order.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrdersSchema
      }
    ], "club")
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {
}
