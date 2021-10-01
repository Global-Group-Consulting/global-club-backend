import {PartialType} from '@nestjs/swagger';
import {CreateOrderDto} from './create-order.dto';
import {OrderStatusEnum} from "../enums/order.status.enum";
import {IsEnum, IsNotEmpty} from "class-validator";

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum({target: OrderStatusEnum})
  status: OrderStatusEnum
}
