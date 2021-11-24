import { PaginatedFilterDto } from '../../_basics/pagination.dto';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FindAllMovementsFilter } from './filters/find-all-movements.filter';

export class PaginatedFilterMovementDto extends PaginatedFilterDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FindAllMovementsFilter)
  filter?: FindAllMovementsFilter
}
