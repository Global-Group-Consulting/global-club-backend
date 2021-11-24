import { FilterMap } from '../../../_basics/FilterMap.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { toString } from '../../../_basics/transformers/toString';
import { toRegExp } from '../../../_basics/transformers/toRegExp';
import { toStringArray } from '../../../_basics/transformers/toStringArray';
import { ToArray } from '../../../_basics/transformers/toArray';

export class FindAllMovementsFilter {
  /*  @ApiProperty({
      name: "filter[type]",
      enum: CommunicationTypeEnum,
      isArray: true,
      required: false,
      example: "filter[order]=pending&filter[type]=chat"
    })
    @IsOptional()
    @ToArray()
    @IsEnum(CommunicationTypeEnum, { each: true })
    type?: CommunicationTypeEnum[]*/
  
  /*  @ApiProperty({
      name: "filter[title]",
      required: false
      // example: "filter[status]=pending&filter[status]=inProgress"
    })
    @IsOptional()
    title?: string*/
}

export const FindAllMovementsFilterMap: FilterMap<FindAllMovementsFilter> = {
  userId: {}
  /*title: {
    castValue: toString,
    query: toRegExp
  },*/
  /* type: {
     castValue: toStringArray
   }*/
}
