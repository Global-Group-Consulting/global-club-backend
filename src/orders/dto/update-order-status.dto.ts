import {PartialType} from '@nestjs/swagger';
import {CreateOrderDto} from './create-order.dto';
import { OrderStatusEnum } from '../enums/order.status.enum'
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator'

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum
  
  @ValidateIf(o => o.status === OrderStatusEnum.CANCELLED)
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  reason: string
}
