import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import {IsBoolean, IsNumber, IsOptional} from 'class-validator';

export class UpdateOrderProductDto {
  @IsOptional()
  @IsNumber()
  qta: number;
  
  @IsOptional()
  @IsNumber()
  price: number;
  
  @IsOptional()
  @IsBoolean()
  repayment: boolean;
}
