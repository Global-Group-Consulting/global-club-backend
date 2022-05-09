import { FilterMap } from '../../../_basics/FilterMap.dto'
import { ProductCategory } from '../../schemas/product-category.schema'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator'
import { toString } from '../../../_basics/transformers/toString'
import { toRegExp } from '../../../_basics/transformers/toRegExp'
import { toNumber } from 'lodash'
import { toArray, ToArray, ToArrayOfNumbers } from '../../../_basics/transformers/toArray'
import { toObjectId, ToObjectId } from '../../../_basics/transformers/toObjectId'
import { castToNumber } from '../../../utilities/Formatters'
import { ToNumber } from '../../../_basics/transformers/toNumber'
import { toBoolean, ToBoolean } from '../../../_basics/transformers/toBoolean'

export class FindAllProductCategoriesFilter implements Partial<ProductCategory> {
  @ApiProperty({
    name: 'filter[title]',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string
  
  @ApiProperty({
    name: 'filter[parent]',
    required: false
  })
  @IsOptional()
  @IsString()
  parent?: any
  
  @ApiProperty({
    name: 'filter[description]',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string
  
  @ApiProperty({
    name: 'filter[level]',
    required: false
  })
  @IsOptional()
  @ToNumber()
  level?: number
  
  @ApiProperty({
    name: 'filter[levels]',
    required: false
  })
  @IsOptional()
  @ToArrayOfNumbers()
  levels?: number[]
 
}

export const FindAllProductCategoriesFilterMap: FilterMap<FindAllProductCategoriesFilter> = {
  title: {
    castValue: toString,
    query: toRegExp
  },
  parent: {
    castValue: toObjectId
  },
  description: {
    castValue: toString,
    query: toRegExp
  },
  level: {
    query: (value) => value === 0 ? [{ level: { $exists: false } }, { level: +value }] : +value,
    keyFormat: (value, level) => level === 0 ? '$or' : 'level'
  },
  levels: {
    // castValue: ToArrayOfNumbers,
    // query: (value) => value === 0 ? [{ level: { $exists: false } }, { level: +value }] : +value,
    query: (levels) => {
      let toReturn: any = { $in: levels }
      
      if (levels.includes(0)) {
        toReturn = [{ level: { $exists: false } }, { level: { $in: levels } }]
      }
      
      return toReturn
    },
    keyFormat: (value, levels) => levels.includes(0) ? '$or' : 'level'
  },
 
}
