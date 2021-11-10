import { PaginatedFilterDto } from '../../_basics/pagination.dto';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FindAllCommunicationsFilter } from './filters/find-all-communications.filter';

export class PaginatedFilterCommunicationDto extends PaginatedFilterDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FindAllCommunicationsFilter)
  filter?: FindAllCommunicationsFilter
}
