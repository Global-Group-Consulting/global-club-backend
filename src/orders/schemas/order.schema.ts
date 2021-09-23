import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BasicSchema} from "../../_basics/BasicSchema";
import {Document, Types, Schema as MongoSchema} from "mongoose";
import {UserBasic} from "../../users/entities/user.basic.entity";
import {Product, ProductSchema} from "../../products/schemas/product.schema";
import {Communication} from "../../communications/schemas/communications.schema";
import {OrderStatusEnum} from "../enums/order.status.enum";

export type OrderDocument = Order & Document;

@Schema({
  timestamps: true
})
export class Order implements BasicSchema {
  @Prop({required: true})
  user: UserBasic;
  
  @Prop({
    type: [{
      type: MongoSchema.Types.ObjectId, ref: "Product"
    }]
  })
  products: Product[];
  
  @Prop({required: false, default: 0})
  amount: number
  
  @Prop({type: MongoSchema.Types.ObjectId, ref: "Communication"})
  communication: Communication
  
  @Prop({enum: OrderStatusEnum})
  status: OrderStatusEnum
  
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const OrdersSchema = SchemaFactory.createForClass(Order)
