import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { Attachment } from "../../_schemas/attachment.schema";
import { IsMongoIdArray } from "../../_basics/validators/IsMongoIdArray";
import { ApiProperty } from '@nestjs/swagger';
import { ToBoolean } from '../../_basics/transformers/toBoolean';
import { PackEnum } from '../../packs/enums/pack.enum';
import { ToArray } from '../../_basics/transformers/toArray';

export class UpdateProductDto {
  @IsNotEmpty()
  title: string;
  
  @IsNotEmpty()
  description: string;
  
  @IsOptional()
  conditions: string;
  
  @Type(() => Number)
  @IsNotEmpty()
  price: number;
  
  @IsOptional()
  @IsArray()
  tags?: string[];
  
  @ApiProperty({
    description: "Indicates if the product is quantifiable of not."
  })
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  hasQta?: boolean;
  
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  priceUndefined?: boolean;
  
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  visible?: boolean;
  
  @IsNotEmpty()
  @IsMongoIdArray()
  categories: string[];
  
  @IsOptional()
  @ToArray()
  @IsEnum(PackEnum, { each: true })
  minPacks: PackEnum[]
  
  @IsOptional()
  @IsObject()
  @Type(() => Attachment)
  thumbnail: Attachment;
  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  images: Attachment[];
}
