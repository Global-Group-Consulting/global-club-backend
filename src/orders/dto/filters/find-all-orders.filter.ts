import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from '../../enums/order.status.enum';
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { FilterMap } from '../../../_basics/FilterMap.dto';
import { toString } from '../../../_basics/transformers/toString';
import { toStringArray } from '../../../_basics/transformers/toStringArray';
import { ToArray } from '../../../_basics/transformers/toArray';
import { toObjectId } from '../../../_basics/transformers/toObjectId';

export class FindAllOrdersFilter {
  @ApiProperty({
    name: "filter[status]",
    enum: OrderStatusEnum,
    example: "filter[status]=pending&filter[status]=inProgress",
    isArray: true,
    required: false
  })
  @IsOptional()
  @ToArray()
  @IsEnum(OrderStatusEnum, { each: true })
  status?: OrderStatusEnum[]
  
  @ApiProperty({
    name: "filter[userId]",
    required: false
  })
  @IsOptional()
  "user"?: string
}

export const FindAllOrdersFilterMap: FilterMap<FindAllOrdersFilter> = {
  status: {
    castValue: toStringArray,
  },
  "user": {
    // Serve aggiungere una funzione che permetta di cambiare anche il nome della chiave in quanto deve essere "user.id"
    keyFormat: () => "user.id"
    // castValue: toObjectId,
    // query: value => ({ "id": value })
  }
}
