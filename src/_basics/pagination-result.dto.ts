import { PaginatedResult, PaginationOptions, PaginationOrderEnum } from './BasicService';

export class PaginatedResultDto implements PaginatedResult {
  data: any;
  filter?: any;
  order: PaginationOrderEnum;
  page: number;
  perPage: number;
  sortBy: string[];
  totalItems: number;
  totalPages: number;
  
}
