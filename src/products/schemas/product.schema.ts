import {Document, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BasicSchema} from "../../_schemas/BasicSchema";
import {Attachment, AttachmentSchema} from "../../_schemas/attachment.schema";

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
})
export class Product implements BasicSchema {
  
  @Prop({required: true})
  title: string;
  
  @Prop({required: true})
  description: string;
  
  @Prop({required: true})
  price: number;
  
  @Prop()
  tags: string[];
  
  @Prop({required: true})
  category: string[];
  
  @Prop({type: AttachmentSchema})
  thumbnail: Attachment;
  
  @Prop({type: [AttachmentSchema]})
  images: Attachment[];
  
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product)
