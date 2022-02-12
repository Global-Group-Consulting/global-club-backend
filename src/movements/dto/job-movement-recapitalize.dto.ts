import {PartialType} from '@nestjs/swagger';
import {IsMongoId, IsNotEmpty, IsNumber, IsString, Min} from "class-validator";

export class JobMovementRecapitalizeDto {
  
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amountEuro: number;
  
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
  
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
