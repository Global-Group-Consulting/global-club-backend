import {Document, Schema as MongoSchema, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BasicSchema} from "../../_schemas/BasicSchema";
import {Attachment, AttachmentSchema} from "../../_schemas/attachment.schema";
import {ProductCategory, ProductCategorySchema} from "../../product-category/schemas/product-category.schema";

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
  
  @Prop({required: true, type: [MongoSchema.Types.ObjectId], ref: "ProductCategory"})
  categories: ProductCategory[] | string[];
  
  @Prop({type: AttachmentSchema})
  thumbnail: Attachment;
  
  @Prop({type: [AttachmentSchema]})
  images: Attachment[];
  
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product)
