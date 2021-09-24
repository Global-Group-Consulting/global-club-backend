import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Schema as MongoSchema} from "mongoose";

@Schema({
  _id: false
})
export class OrderProduct extends Document {
  @Prop({
    type: MongoSchema.Types.ObjectId, ref: "Product",
    alias: "id"
  })
  product: string;
  
  @Prop()
  qta: number;
}

export const orderProductSchema = SchemaFactory.createForClass(OrderProduct);
