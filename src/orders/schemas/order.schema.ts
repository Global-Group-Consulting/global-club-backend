import {Schema, SchemaFactory} from "@nestjs/mongoose";
import {BasicSchema} from "../../_basics/BasicSchema";
import {Document, Types} from "mongoose";

export type OrderDocument = Order & Document;

@Schema({
  timestamps: true
})
export class Order implements BasicSchema {
  
  
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
}

export const OrdersSchema = SchemaFactory.createForClass(Order)
