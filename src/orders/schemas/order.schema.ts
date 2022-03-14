import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BasicSchema } from "../../_schemas/BasicSchema";
import { Document, Types, Schema as MongoSchema } from "mongoose";
import { UserBasic } from "../../users/entities/user.basic.entity";
import { Communication } from "../../communications/schemas/communications.schema";
import { OrderStatusEnum } from "../enums/order.status.enum";
import { OrderProduct, orderProductSchema } from "./order-product";
import { classToClass, classToPlain, classToPlainFromExist, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export type OrderDocument = Order & Document;

@Schema({
  timestamps: true
})
export class Order extends BasicSchema {
  @Prop({ required: true })
  public user!: UserBasic;
  
  @Prop({ type: [orderProductSchema] })
  public products: OrderProduct[];
  
  @Prop({required: false, default: 0})
  public amount: number
  
  @Prop({type: MongoSchema.Types.ObjectId, ref: "Communication"})
  public communication: Communication
  
  @Prop({enum: OrderStatusEnum, default: OrderStatusEnum.PENDING})
  public status: OrderStatusEnum
  
  @Prop()
  public cancelReason: string;
  
  @Prop()
  public notes: string
  
  @Prop()
  public packChangeOrder: boolean
  
  @Prop({default: 0})
  public packChangeCost: number
  
  @Prop({default: false})
  public hasUnreadMessages: boolean
  
  public _id: Types.ObjectId;
  public createdAt: Date;
  public updatedAt: Date;
}

/*
export const OrderProjection = test.reduce((acc, key) => {
  if (key !== "user") {
    acc[key] = 1
  } else {
    Object.keys(new UserBasic()).forEach(userKey => {
      acc["user." + userKey] = 1
    })
  }
  
  return acc
}, {})*/

export const OrdersSchema = SchemaFactory.createForClass(Order)
