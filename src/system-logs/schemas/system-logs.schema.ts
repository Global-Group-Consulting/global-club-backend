import { Document, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BasicSchema } from "../../_schemas/BasicSchema";

export type SystemLogDocument = SystemLog & Document;

@Schema({
  timestamps: true,
  collection: "system_logs"
})
export class SystemLog implements BasicSchema {
  @Prop()
  code: string;
  
  @Prop()
  message: string;
  
  @Prop()
  name: string;
  
  @Prop()
  status: number;
  
  @Prop()
  stack: any[];
  
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const SystemLogSchema = SchemaFactory.createForClass(SystemLog)
