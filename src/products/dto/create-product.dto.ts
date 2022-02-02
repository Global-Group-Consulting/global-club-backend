import { IsArray, IsBoolean, IsNotEmpty, IsObject, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Attachment } from "../../_schemas/attachment.schema";
import { IsMongoIdArray } from "../../_basics/validators/IsMongoIdArray";
import { ApiProperty } from '@nestjs/swagger';
import { ToBoolean } from '../../_basics/transformers/toBoolean';

export class CreateProductDto {
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
  @IsBoolean()
  @ToBoolean()
  hasQta?: boolean;
  
  @IsNotEmpty()
  @IsMongoIdArray()
  categories: string[];
  
  @IsNotEmpty()
  @IsObject()
  // @ValidateNested({ each: true })
  @Type(() => Attachment)
  thumbnail: Attachment;
  
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => Attachment)
  images: Attachment[];
}
