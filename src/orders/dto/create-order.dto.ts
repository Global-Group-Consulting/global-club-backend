import {ApiProperty} from "@nestjs/swagger";
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
} from "class-validator";
import {Schema} from "mongoose";
import {IsMongoIdArray} from "../../_basics/validators/IsMongoIdArray";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoIdArray()
  @ApiProperty({description: "A list of products id"})
  products: Schema.Types.ObjectId[]
}
