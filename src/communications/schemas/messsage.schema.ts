import {UserBasic} from "../../users/entities/user.basic.entity";
import {BasicSchema} from "../../_basics/BasicSchema";
import {Types} from "mongoose";
import {User} from "../../users/entities/user.entity";
import {MessageUser} from "./message.user.schema";

export class Message implements BasicSchema {
  sender: UserBasic = null
  
  content: string = ""
  
  readonly _id: Types.ObjectId = new Types.ObjectId();
  readonly createdAt: Date = new Date();
  readonly updatedAt: Date = new Date();
  
  constructor(message: string, sender: Partial<User>) {
    this.content = message;
    this.sender = new MessageUser(sender);
  }
}

