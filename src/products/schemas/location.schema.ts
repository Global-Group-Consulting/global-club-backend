import {IsNotEmpty} from "class-validator";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({
  _id: false
})
export class Location {
  @Prop()
  city: string;
  
  @Prop()
  province: string;
  
  @Prop()
  region: string;
}


export const LocationSchema = SchemaFactory.createForClass(Location)
