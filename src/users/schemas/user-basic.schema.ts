import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type UserBasicDocument = UserBasic & Document

@Schema({
  _id: false,
  collection: "users"
})
export class UserBasic {
  @Prop({ alias: "id" })
  _id: string
  
  @Prop()
  clubPack: string
  
  @Prop()
  gold: boolean
  
  @Prop()
  email: string
  
  @Prop()
  firstName: string
  
  @Prop()
  lastName: string
  
  @Prop()
  referenceAgent: string
  
  @Prop()
  role: number
  
  @Prop()
  roles: string[]
  
  @Prop()
  superAdmin: boolean
}

export const UserBasicSchema = SchemaFactory.createForClass(UserBasic)
