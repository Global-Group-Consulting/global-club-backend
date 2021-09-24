import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Schema as MongoSchema} from "mongoose";

@Schema({
  _id: false
})
export class OrderProduct {
  @Prop({
    type: MongoSchema.Types.ObjectId, ref: "Product",
    alias: "id"
  })
  product: string;
  
  @Prop()
  qta: number;
}

export const orderProductSchema = SchemaFactory.createForClass(OrderProduct);
