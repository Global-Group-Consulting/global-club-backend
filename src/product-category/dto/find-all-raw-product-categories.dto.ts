import { PaginatedFilterDto } from '../../_basics/pagination.dto'
import { IsObject, IsOptional, ValidateNested } from 'class-validator'
import { FindAllProductCategoriesFilter } from './filters/find-all-product-categories.filter'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { ToArrayOfNumbers } from '../../_basics/transformers/toArray'

export class FindAllRawProductCategoriesDto {
  @ApiProperty({
    name: 'sortBy[propName]',
    description: 'Example: sortBy[_id]=1&sortBy[createdAt]=-1',
    type: Number,
    default: null,
    required: false
  })
  @IsOptional()
  @ToArrayOfNumbers()
  sortBy?: Record<string, number>[] = [{ '_id': 1 }]
  
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FindAllProductCategoriesFilter)
  filter?: FindAllProductCategoriesFilter
}
