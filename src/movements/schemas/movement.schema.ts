import {Document, Mongoose, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {MovementType} from "../enums/MovementType";

export type MovementDocument = Movement & Document;

@Schema()
export class Movement {
  
  @Prop()
  amountChange: number;
  
  @Prop()
  userId: Types.ObjectId;
  
  @Prop({required: false})
  created_by?: Types.ObjectId
  
  @Prop()
  semesterId: string;
  
  @Prop()
  referenceSemester: number;
  
  @Prop()
  movementType: MovementType;
  
  @Prop()
  usableFrom: Date;
  
  @Prop()
  expiresAt: Date;
  
  /* ReadOnly props */
  
  _id: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
  
  /**
   * @deprecated
   */
  deposit?: number;
}

export const MovementSchema = SchemaFactory.createForClass(Movement)
