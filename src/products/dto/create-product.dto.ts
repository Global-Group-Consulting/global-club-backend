import {ProductImage} from "../schemas/product.schema";
import {IsArray, IsNotEmpty, IsObject, IsOptional, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class CreateProductDto {
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
