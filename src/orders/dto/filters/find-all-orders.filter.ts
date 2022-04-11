import {ApiProperty} from '@nestjs/swagger';
import {OrderStatusEnum} from '../../enums/order.status.enum';
import {IsEnum, IsNotEmpty, IsOptional, ValidateNested} from 'class-validator';
import {FilterMap} from '../../../_basics/FilterMap.dto';
import {toString} from '../../../_basics/transformers/toString';
import {toStringArray} from '../../../_basics/transformers/toStringArray';
import {ToArray} from '../../../_basics/transformers/toArray';
import { castToObjectId } from '../../../utilities/Formatters'
import { toBoolean } from '../../../_basics/transformers/toBoolean'

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
  @IsEnum(OrderStatusEnum, {each: true})
  status?: OrderStatusEnum[]
  
  @ApiProperty({
    name: "filter[userId]",
    required: false
  })
  @IsOptional()
  "userId"?: string
  
  @ApiProperty({
    name: "filter[user]",
    required: false
  })
  @IsOptional()
  'user'?: string
  
  @ApiProperty({
    name: 'filter[id]',
    required: false
  })
  @IsOptional()
  'id'?: string
  
  @ApiProperty({
    name: 'filter[packChangeOrder]',
    required: false
  })
  @IsOptional()
  'packChangeOrder'?: string
}

export const FindAllOrdersFilterMap: FilterMap<FindAllOrdersFilter> = {
  status: {
    castValue: toStringArray,
  },
  "userId": {
    // Serve aggiungere una funzione che permetta di cambiare anche il nome della chiave in quanto deve essere "user.id"
    keyFormat: () => "user.id"
    // castValue: toObjectId,
    // query: value => ({ "id": value })
  },
  'user': {
    castValue: toString,
    query: value => ({ '$regex': value.replace(/ /g, '|'), '$options': 'i' })
  },
  'id': {
    castValue: castToObjectId,
    keyFormat: value => '_' + value
  },
  'packChangeOrder': {
    castValue: toBoolean
  }
}
