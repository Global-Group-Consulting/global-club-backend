import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Schema as MongoSchema} from "mongoose";
import { IsOptional, IsString } from 'class-validator'

@Schema({
  _id: false
})
export class OrderProduct extends Document {
  @Prop({
    type: MongoSchema.Types.ObjectId, ref: 'Product',
    alias: 'id'
  })
  product: string
  
  @Prop()
  qta: number
  
  /*
  Store the product price so if it changes in the meanwhile, we have a reference for the original price,
  the one user saw when adding the product to the cart
   */
  @Prop()
  price: number
  
  @Prop({default: false})
  repayment: boolean;
  
  @Prop()
  notes: string;
}

export const orderProductSchema = SchemaFactory.createForClass(OrderProduct);
