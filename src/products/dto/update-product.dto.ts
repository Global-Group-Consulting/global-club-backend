import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {IsArray, IsNotEmpty, IsObject, IsOptional, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {Attachment} from "../../_schemas/attachment.schema";

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  title: string;
  
  @IsNotEmpty()
  description: string;
  
  @Type(() => Number)
  @IsNotEmpty()
  price: number;
  
  @IsOptional()
  @IsArray()
  tags?: string[];
  
  @IsNotEmpty()
  @IsArray()
  category: string[];
  
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({each: true})
  @Type(() => Attachment)
  thumbnail: Attachment;
  
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => Attachment)
  images: Attachment[];
}
