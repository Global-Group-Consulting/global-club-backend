import {Attachment, AttachmentSchema} from "../../_schemas/attachment.schema";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {UserBasic} from "../../users/entities/user.basic.entity";
import {Document, Types} from "mongoose";
import {MessageTypeEnum} from "../enums/message.type.enum";
import {User} from '../../users/schemas/user.schema';
import {MessageRead, MessageReadSchema} from "./messsage.read.schema";

@Schema({
  timestamps: true,
  excludeIndexes: ["readings"]
})
export class Message extends Document {
  @Prop({type: User})
  sender: UserBasic
  
  @Prop({type: [AttachmentSchema]})
  attachments: Attachment[] = []
  
  @Prop({required: true})
  content: string
  
  @Prop({default: MessageTypeEnum.MESSAGE, enum: MessageTypeEnum})
  type: string
  
  @Prop({type: Object})
  data: object
  
  @Prop({type: [MessageReadSchema]})
  readings: MessageRead[]
  
  @Prop({type: MessageRead})
  isRead: MessageRead
}

export const MessageSchema = SchemaFactory.createForClass(Message)
