import {IsArray, IsNotEmpty, IsObject, IsOptional, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {Attachment} from "../../_schemas/attachment.schema";

export class CreateProductCategoryDto {
  @IsNotEmpty()
  title: string;
  
  @IsNotEmpty()
  description: string;
  
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({each: true})
  @Type(() => Attachment)
  thumbnail: Attachment;
}
