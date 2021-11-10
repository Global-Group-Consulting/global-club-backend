import { FilterMap } from '../../../_basics/FilterMap.dto';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from '../../../orders/enums/order.status.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { CommunicationTypeEnum } from '../../enums/communication.type.enum';
import { toString } from '../../../_basics/transformers/toString';
import { toRegExp } from '../../../_basics/transformers/toRegExp';
import { toStringArray } from '../../../_basics/transformers/toStringArray';

export class FindAllCommunicationsFilter {
  @ApiProperty({
    name: "filter[type]",
    enum: CommunicationTypeEnum,
    isArray: true,
    required: false,
    example: "filter[order]=pending&filter[type]=chat"
  })
  // TODO:: controllare perchè viene inviato il campo vuoto
  @IsOptional()
  @IsEnum(CommunicationTypeEnum, { each: true })
  type?: CommunicationTypeEnum[]
  
  @ApiProperty({
    name: "filter[title]",
    required: false
    // example: "filter[status]=pending&filter[status]=inProgress"
  })
  @IsOptional()
  title?: string
}

export const FindAllCommunicationsFilterMap: FilterMap<FindAllCommunicationsFilter> = {
  title: {
    castValue: toString,
    query: toRegExp
  },
  type: {
    castValue: toStringArray
  }
}
