import { PaginatedFilterDto } from '../../_basics/pagination.dto';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { FindAllProductCategoriesFilter } from './filters/find-all-product-categories.filter';
import { Type } from 'class-transformer';

export class PaginatedFindAllProductCategoriesDto extends PaginatedFilterDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FindAllProductCategoriesFilter)
  filter?: FindAllProductCategoriesFilter
}
