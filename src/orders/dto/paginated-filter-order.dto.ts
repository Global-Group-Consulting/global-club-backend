import { OrderStatusEnum } from '../enums/order.status.enum';
import { PaginatedFilterDto } from '../../_basics/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined, IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject, IsOptional,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class Filters {
  @ApiProperty({
    name: "filter[status]",
    enum: OrderStatusEnum,
    example: "filter[status]=pending&filter[status]=inProgress"
  })
  @IsNotEmpty()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum[]
}

export class PaginatedFilterOrderDto extends PaginatedFilterDto {
  // @IsDefined()
  // @IsNotEmptyObject()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Filters)
  filter?: Filters
}
