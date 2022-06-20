import { IsMongoId, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class JobMovementRecapitalizeDto {
  
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +(value.toFixed(2)))
    // @Min(1)
  amountEuro: number
  
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => +(value.toFixed(2)))
    // @Min(1)
  amount: number
  
  @IsNotEmpty()
  @IsMongoId()
  userId: string
  
  @IsNotEmpty()
  @IsString()
  fromUUID: string
}
