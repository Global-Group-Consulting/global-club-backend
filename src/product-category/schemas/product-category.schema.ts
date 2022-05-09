import { Document, Schema as MongoSchema, Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BasicSchema } from '../../_schemas/BasicSchema'
import { Attachment, AttachmentSchema } from '../../_schemas/attachment.schema'

export type ProductCategoryDocument = ProductCategory & Document;

@Schema({
  timestamps: true,
  collection: 'product_categories'
})
export class ProductCategory extends BasicSchema {
  
  @Prop({ required: true })
  title: string
  
  @Prop({ required: true })
  description: string
  
  @Prop({ type: AttachmentSchema })
  thumbnail: Attachment
  
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'ProductCategory' })
  parent: ProductCategory
  
  @Prop({ default: 0 })
  level: number
  
  levels: number[]
  
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const ProductCategorySchema = SchemaFactory.createForClass(ProductCategory)
