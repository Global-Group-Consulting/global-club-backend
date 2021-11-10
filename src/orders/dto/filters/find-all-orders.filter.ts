import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from '../../enums/order.status.enum';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { FilterMap } from '../../../_basics/FilterMap.dto';
import { toString } from '../../../_basics/transformers/toString';
import { toStringArray } from '../../../_basics/transformers/toStringArray';

export class FindAllOrdersFilter {
  @ApiProperty({
    name: "filter[status]",
    enum: OrderStatusEnum,
    example: "filter[status]=pending&filter[status]=inProgress",
    isArray: true,
    required: false
  })
  // @IsNotEmpty()
  // @ValidateNested()
  @IsEnum(OrderStatusEnum, {each: true})
  status?: OrderStatusEnum[]
}

export const FindAllOrdersFilterMap: FilterMap<FindAllOrdersFilter> = {
  status: {
    castValue: toStringArray
  }
}
