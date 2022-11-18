import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class CartProduct {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
  
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  qta: number;
  
  price?: number;
  
  @IsOptional()
  @IsString()
  notes?: string;
}
