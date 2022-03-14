import {Document, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {CommunicationClientEnum} from "../enums/communication.client.enum";
import {UserBasic} from "../../users/entities/user.basic.entity";
import {Message, MessageSchema} from "../schemas/messsage.schema";
import { BasicSchema } from "../../_schemas/BasicSchema";
import { UserSchema } from "../../users/schemas/user.schema";

export type CommunicationDocument = Communication & Document;

@Schema({
  timestamps: true
})
export class Communication extends BasicSchema {
  @Prop({required: true})
  type: string
  
  /* Array of messages */
  @Prop({required: true, type: [MessageSchema]})
  messages: Message[]
  
  @Prop({required: true})
  title: string
  
  // All communications from this application will have CLUB as client value
  @Prop({default: CommunicationClientEnum.CLUB})
  client: string
  
  @Prop({ type: UserSchema, alias: "user" })
  initiator: UserBasic
  
  @Prop({ type: [UserSchema] })
  receivers: UserBasic[]
  
  @Prop({ type: [UserSchema] })
  watchers: UserBasic[]
  
  // var set dynamically before returning data to the user.
  // This will be based on the auth user and indicates if there are any unread messages
  @Prop({ default: false })
  hasUnreadMessages: boolean
  
  @Prop({ default: 0 })
  unreadCount: number
  
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CommunicationsSchema = SchemaFactory.createForClass(Communication)
