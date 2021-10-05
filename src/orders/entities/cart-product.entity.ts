import {IsMongoId, IsNotEmpty, IsNumber, Min} from "class-validator";

export class CartProduct {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
  
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  qta: number;
}
