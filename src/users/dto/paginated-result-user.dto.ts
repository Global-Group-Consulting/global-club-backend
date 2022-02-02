import { PaginatedResultDto } from '../../_basics/pagination-result.dto';
import { User } from '../schemas/user.schema';
import { PaginatedFilterUserDto } from './paginated-filter-user.dto';

export class PaginatedResultUserDto extends PaginatedResultDto {
  data: User[]
  filter?: Pick<PaginatedFilterUserDto, "filter">
}
