import { PaginatedResultDto } from '../../_basics/pagination-result.dto';
import { PaginatedFilterUserDto } from '../../users/dto/paginated-filter-user.dto';
import {ProductCategory} from "../schemas/product-category.schema";

export class PaginatedResultProductCategoryDto extends PaginatedResultDto {
  data: ProductCategory[];
  filter?: Pick<PaginatedFilterUserDto, "filter">;
}
