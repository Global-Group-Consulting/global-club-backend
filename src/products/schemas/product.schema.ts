import { Document, Schema as MongoSchema, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BasicSchema } from "../../_schemas/BasicSchema";
import { Attachment, AttachmentSchema } from "../../_schemas/attachment.schema";
import { ProductCategory, ProductCategorySchema } from "../../product-category/schemas/product-category.schema";
import { PackEnum } from '../../packs/enums/pack.enum';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
})
export class Product extends BasicSchema {
  
  @Prop({ required: true })
  title: string;
  
  @Prop({ required: true })
  description: string;
  
  @Prop({ required: true })
  price: number;
  
  @Prop({})
  priceUndefined: boolean;
  
  /**
   * Indicates if the product is quantifiable of not.
   */
  @Prop({ default: true })
  hasQta: boolean
  
  /**
   * Indicates if the product is visible to the public or not
   */
  @Prop({ default: true })
  visible: boolean
  
  @Prop()
  tags: string[];
  
  @Prop({ required: true, type: [MongoSchema.Types.ObjectId], ref: "ProductCategory" })
  categories: ProductCategory[] | string[];
  
  @Prop({ type: AttachmentSchema })
  thumbnail: Attachment;
  
  @Prop({ type: [AttachmentSchema] })
  images: Attachment[];
  
  @Prop({ type: Array })
  minPacks: PackEnum[];
  
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product)
