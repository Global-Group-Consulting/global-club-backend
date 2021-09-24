import {IsMongoId, IsNotEmpty, IsNumber} from "class-validator";

export class CartProduct {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
  
  @IsNotEmpty()
  @IsNumber()
  qta: number;
}
