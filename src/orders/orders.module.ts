import {Module} from '@nestjs/common';
import {OrdersService} from './orders.service';
import {OrdersController} from './orders.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Order, OrdersSchema} from "./schemas/order.schema";
import {Product, ProductSchema} from "../products/schemas/product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrdersSchema
      },
      {
        name: Product.name,
        schema: ProductSchema
      }
    ], "club")
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {
}
