import { PaginatedFilterDto } from '../../_basics/pagination.dto';
import { Product } from '../schemas/product.schema';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { FindAllProductsFilter } from './filters/find-all-products.filter';
import { Type } from 'class-transformer';

export class PaginatedFindAllProductDto extends PaginatedFilterDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FindAllProductsFilter)
  filter?: FindAllProductsFilter
}
