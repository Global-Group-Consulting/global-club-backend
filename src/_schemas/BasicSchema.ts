import {Types} from "mongoose";
import {Prop} from "@nestjs/mongoose";

export class BasicSchema {
  /* ReadOnly props */
  
  @Prop({type: Types.ObjectId})
  _id: Types.ObjectId;
  
  @Prop({type: Date})
  createdAt: Date;
  
  @Prop({type: Date})
  updatedAt: Date;
}
