import {Document, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BasicSchema} from "../../_basics/BasicSchema";

export type ProductDocument = Product & Document;

export class ProductImage {
  id: string;
  fileName: string;
  size: number;
  mimetype: string;
}

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
  
  @Prop({type: ProductImage})
  thumbnail: ProductImage;
  
  @Prop({type: ProductImage})
  images: ProductImage[];
  
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product)
