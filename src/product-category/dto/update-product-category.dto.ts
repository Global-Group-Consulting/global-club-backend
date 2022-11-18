import { PartialType } from '@nestjs/swagger';
import { CreateProductCategoryDto } from './create-product-category.dto';
import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'
import {Type} from "class-transformer";
import {Attachment} from "../../_schemas/attachment.schema";

export class UpdateProductCategoryDto {
  @IsNotEmpty()
  title: string;
  
  @IsNotEmpty()
  description: string;
  
  @IsOptional()
  @IsObject()
  @ValidateNested({each: true})
  @Type(() => Attachment)
  thumbnail: Attachment;
  
  @IsOptional()
  @IsString()
  parent: string
  
  level: number;
}
