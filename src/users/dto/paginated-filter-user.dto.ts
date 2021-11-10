import { PaginatedFilterDto } from '../../_basics/pagination.dto';
import {
  IsObject, IsOptional,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { FindAllUserFilter } from './filters/find-all-user.filter';

export class PaginatedFilterUserDto extends PaginatedFilterDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FindAllUserFilter)
  filter?: FindAllUserFilter
}
