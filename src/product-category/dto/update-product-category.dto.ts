import { PartialType } from '@nestjs/swagger';
import { CreateProductCategoryDto } from './create-product-category.dto';
import {IsNotEmpty, IsObject, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {Attachment} from "../../_schemas/attachment.schema";

export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {
  @IsString()
  title: string;
  
  @IsString()
  description: string;
  
  @IsObject()
  @ValidateNested({each: true})
  @Type(() => Attachment)
  thumbnail: Attachment;
}
