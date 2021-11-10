import { PaginatedResultDto } from '../../_basics/pagination-result.dto';
import { Product } from '../schemas/product.schema';
import { PaginatedFilterUserDto } from '../../users/dto/paginated-filter-user.dto';

export class PaginatedResultProductDto extends PaginatedResultDto {
  data: Product[];
  filter?: Pick<PaginatedFilterUserDto, "filter">;
}
