import {Types} from "mongoose";

export class BasicSchema {
  /* ReadOnly props */
  
  _id: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}
