import {ApiProperty} from "@nestjs/swagger";
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty, ValidateNested,
} from "class-validator";
import {IsMongoIdArray} from "../../_basics/validators/IsMongoIdArray";
import {CartProduct} from "../entities/cart-product.entity";
import {Type} from "class-transformer";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CartProduct)
  @ValidateNested({each: true})
  products: CartProduct[]
}
