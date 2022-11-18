import { FilterMap } from '../../../_basics/FilterMap.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { toString } from '../../../_basics/transformers/toString';
import { toRegExp } from '../../../_basics/transformers/toRegExp';
import { toStringArray } from '../../../_basics/transformers/toStringArray';
import { ToArray } from '../../../_basics/transformers/toArray';
import { OrderStatusEnum } from '../../../orders/enums/order.status.enum';
import { PackEnum } from '../../../packs/enums/pack.enum'

export class FindAllMovementsFilter {
  @ApiProperty({
    name: "filter[semesterId]",
    example: "filter[semesterId]=2021_1",
    required: false
  })
  @IsOptional()
  semesterId: string
  
  @ApiProperty({
    name: "filter[clubPack]",
    example: "filter[clubPack]=fast",
    required: false
  })
  @IsOptional()
  clubPack: PackEnum
}

export const FindAllMovementsFilterMap: FilterMap<FindAllMovementsFilter> = {
  semesterId: {},
  clubPack: {},
  /*title: {
    castValue: toString,
    query: toRegExp
  },*/
  /* type: {
     castValue: toStringArray
   }*/
}
