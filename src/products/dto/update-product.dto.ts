import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {IsArray, IsNotEmpty, IsObject, IsOptional, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ProductImage} from "../schemas/product.schema";

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
  @Type(() => ProductImage)
  thumbnail: ProductImage;
  
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ProductImage)
  images: ProductImage[];
}
