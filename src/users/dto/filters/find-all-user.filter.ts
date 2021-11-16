import { FilterMap } from '../../../_basics/FilterMap.dto';
import { toRegExp } from '../../../_basics/transformers/toRegExp';
import { toString } from '../../../_basics/transformers/toString';
import { User } from '../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { castToNumber } from '../../../utilities/Formatters';

export class FindAllUserFilter implements Partial<User> {
  @ApiProperty({
    name: "filter[email]",
    required: false
    // example: "filter[email]"
  })
  email?: string
  
  @ApiProperty({
    name: "filter[firstName]",
    required: false
    // example: "filter[firstName]"
  })
  firstName?: string
  
  @ApiProperty({
    name: "filter[lastName]",
    required: false
    // example: "filter[lastName]"
  })
  lastName?: string
  
  @ApiProperty({
    name: "filter[role]",
    required: false
    // example: "filter[lastName]"
  })
  role?: number
}

export const FindAllUserFilterMap: FilterMap<FindAllUserFilter> = {
  firstName: {
    query: toRegExp,
    castValue: toString
  },
  lastName: {
    query: toRegExp,
    castValue: toString
  },
  email: {
    query: toRegExp,
    castValue: toString
  },
  role: {
    castValue: castToNumber
  },
}



