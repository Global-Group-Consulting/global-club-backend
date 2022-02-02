import { PaginatedResultDto } from '../../_basics/pagination-result.dto';
import { PaginatedFilterMovementDto } from './paginated-filter-movement.dto';
import { Movement } from '../schemas/movement.schema';

export class PaginatedResultMovementDto extends PaginatedResultDto {
  data: Movement[]
  filter?: Pick<PaginatedFilterMovementDto, "filter">
}
