import { PaginatedResultDto } from '../../_basics/pagination-result.dto';
import { User } from '../entities/user.entity';
import { PaginatedFilterUserDto } from './paginated-filter-user.dto';

export class PaginatedResultUserDto extends PaginatedResultDto {
  data: User[]
  filter?: Pick<PaginatedFilterUserDto, "filter">
}
