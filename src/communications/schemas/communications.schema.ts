import {Document, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {CommunicationClientEnum} from "../enums/communication.client.enum";
import {UserBasic} from "../../users/entities/user.basic.entity";
import {Message, MessageSchema} from "../schemas/messsage.schema";
import {BasicSchema} from "../../_schemas/BasicSchema";
import {UserBasicSchema} from "../../users/schemas/user-basic.schema";

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
  
  @Prop({type: UserBasicSchema, alias: "user"})
  initiator: UserBasic
  
  @Prop({type: [UserBasicSchema]})
  receivers: UserBasic[]
  
  @Prop({type: [UserBasicSchema]})
  watchers: UserBasic[]
  
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CommunicationsSchema = SchemaFactory.createForClass(Communication)
