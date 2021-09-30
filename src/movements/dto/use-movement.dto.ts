import {PartialType} from '@nestjs/swagger';
import {IsMongoId, IsNotEmpty, IsNumber, IsString, Min} from "class-validator";

export class UseMovementDto {
  
  @IsNumber()
  @Min(1)
  amountChange: number;
  
  @IsNotEmpty()
  @IsString()
  notes: string;
  
  @IsNotEmpty()
  @IsMongoId()
  orderId: string;
}
