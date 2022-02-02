import { PaginatedFilterDto } from '../../_basics/pagination.dto';
import {
  IsObject, IsOptional,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { FindAllOrdersFilter } from './filters/find-all-orders.filter';


export class PaginatedFilterOrderDto extends PaginatedFilterDto {
  // @IsDefined()
  // @IsNotEmptyObject()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FindAllOrdersFilter)
  filter?: FindAllOrdersFilter
}
