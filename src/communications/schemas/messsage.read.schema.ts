import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

@Schema({
  timestamps: true
})
export class MessageRead extends Document {
  @Prop()
  userId: Types.ObjectId
}

export const MessageReadSchema = SchemaFactory.createForClass(MessageRead)
