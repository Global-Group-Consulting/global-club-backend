import {Document, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {CommunicationClientEnum} from "../enums/communication.client.enum";
import {UserBasic} from "../../users/entities/user.basic.entity";
import {Message} from "../schemas/messsage.schema";
import {BasicSchema} from "../../_basics/BasicSchema";

export type CommunicationDocument = Communication & Document;

@Schema({
  timestamps: true
})
export class Communication extends BasicSchema {
  @Prop({required: true})
  type: string
  
  /* Array of messages */
  @Prop({required: true, type: Message})
  messages: Message[]
  
  @Prop({required: true})
  title: string
  
  // All communications from this application will have CLUB as client value
  @Prop({default: CommunicationClientEnum.CLUB})
  client: string
  
  @Prop({type: UserBasic})
  sender: UserBasic
  
  @Prop({type: UserBasic})
  receivers: UserBasic[]
  
  @Prop({type: UserBasic})
  watchers: UserBasic[]
  
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CommunicationsSchema = SchemaFactory.createForClass(Communication)
