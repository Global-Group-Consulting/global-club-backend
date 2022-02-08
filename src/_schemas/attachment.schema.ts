import {IsNotEmpty} from "class-validator";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({
  _id: false
})
export class Attachment {
  @IsNotEmpty()
  @Prop()
  id: string;
  
  @IsNotEmpty()
  @Prop()
  fileName: string;
  
  @IsNotEmpty()
  @Prop()
  size: number;
  
  @IsNotEmpty()
  @Prop()
  mimetype: string;
  
  @Prop({default: "legacy"})
  server: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment)
