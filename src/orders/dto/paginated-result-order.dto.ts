import { PaginatedResult, PaginationOptions } from '../../_basics/BasicService';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResultDto } from '../../_basics/pagination-result.dto';
import { PaginatedFilterDto } from '../../_basics/pagination.dto';
import { Order } from '../schemas/order.schema';
import { PaginatedFilterOrderDto } from './paginated-filter-order.dto';

export class PaginatedResultOrderDto extends PaginatedResultDto {
  data: Order[]
  filter?: Pick<PaginatedFilterOrderDto, "filter">
}
