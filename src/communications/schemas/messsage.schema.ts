import { Attachment, AttachmentSchema } from "../../_schemas/attachment.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserBasic } from "../../users/entities/user.basic.entity";
import { Document } from "mongoose";
import { MessageTypeEnum } from "../enums/message.type.enum";
import { User } from '../../users/schemas/user.schema';

@Schema({
  timestamps: true
})
export class Message extends Document {
  @Prop({ type: User })
  sender: UserBasic
  
  @Prop({ type: [AttachmentSchema] })
  attachments: Attachment[] = []
  
  @Prop({ required: true })
  content: string
  
  @Prop({ default: MessageTypeEnum.MESSAGE, enum: MessageTypeEnum })
  type: string
  
  @Prop({type: Object})
  data: object
}

export const MessageSchema = SchemaFactory.createForClass(Message)
