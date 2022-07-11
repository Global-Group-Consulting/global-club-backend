import { Document, Schema as MongoSchema, Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { MovementTypeEnum } from '../enums/movement.type.enum'
import { calcBritesUsage } from '../utils/movements.utils'
import { castToFixedDecimal } from '../../utilities/Formatters'
import { PackEnum } from '../../packs/enums/pack.enum'

export type MovementDocument = Movement & Document;

@Schema({
  timestamps: true
})
export class Movement {
  
  @Prop({ required: true, set: (val: number) => castToFixedDecimal(val) })
  amountChange: number
  
  @Prop({ type: MongoSchema.Types.ObjectId, required: true })
  userId: string
  
  @Prop({ required: false, type: MongoSchema.Types.ObjectId, alias: 'created_by' })
  createdBy?: string
  
  @Prop({ required: true })
  semesterId: string
  
  @Prop({})
  notes: string
  
  @Prop({ required: true })
  movementType: MovementTypeEnum
  
  @Prop({})
  fromUUID: string
  
  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'Orders' })
  order: string
  
  @Prop({ required: true })
  clubPack: PackEnum
  
  @Prop({})
  clubPackChange: any[]
  
  @Prop({
    immutable: true,
    default: (data: MovementDocument) => {
      return +data.semesterId.split('_')[1]
    }
  })
  referenceSemester: number
  
  @Prop({
    immutable: true,
    default: (data: MovementDocument) => {
      return +data.semesterId.split('_')[0]
    }
  })
  referenceYear: number
  
  @Prop({
    immutable: true,
    default: (data: MovementDocument) => calcBritesUsage(data.semesterId).usableFrom
  })
  usableFrom: Date
  
  @Prop({
    immutable: true,
    default: (data: MovementDocument) => calcBritesUsage(data.semesterId).expiresAt
  })
  expiresAt: Date
  
  /* ReadOnly props */
  
  _id: Types.ObjectId
  createdAt: Date
  created_at?: Date
  updated_at?: Date
  updatedAt: Date
  
  /**
   * @deprecated
   */
  deposit?: number
}

export const MovementSchema = SchemaFactory.createForClass(Movement)
