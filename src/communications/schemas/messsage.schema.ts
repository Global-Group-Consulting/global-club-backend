import {UserBasic} from "../../users/entities/user.basic.entity";
import {BasicSchema} from "../../_basics/BasicSchema";
import {Types} from "mongoose";
import {User} from "../../users/entities/user.entity";
import {MessageUser} from "./message.user.schema";
import {AddMessageCommunicationDto} from "../dto/add-message-communication.dto";
import {Attachment} from "../../_basics/attachment.entity";

export class Message implements BasicSchema {
  sender: UserBasic = null
  attachments: Attachment[] = null
  content: string = null
  
  readonly _id: Types.ObjectId = new Types.ObjectId();
  readonly createdAt: Date = new Date();
  readonly updatedAt: Date = new Date();
  
  constructor(data: AddMessageCommunicationDto, sender: Partial<User>) {
    this.content = data.message;
    this.attachments = data.attachments;
    this.sender = new MessageUser(sender);
  }
}

