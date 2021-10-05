import {Attachment, AttachmentSchema} from "../../_schemas/attachment.schema";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {UserBasic, UserBasicSchema} from "../../users/schemas/user-basic.schema";
import {Document} from "mongoose";
import {MessageTypeEnum} from "../enums/message.type.enum";

@Schema({
  timestamps: true
})
export class Message extends Document {
  @Prop({type: UserBasicSchema, required: true})
  sender: UserBasic
  
  @Prop({type: [AttachmentSchema]})
  attachments: Attachment[] = []
  
  @Prop({required: true})
  content: string
  
  @Prop({default: MessageTypeEnum.MESSAGE, enum: MessageTypeEnum})
  type: string
}

export const MessageSchema = SchemaFactory.createForClass(Message)
