import { PaginatedResult, PaginationOrderEnum } from './BasicService';

export class PaginatedResultDto implements PaginatedResult {
  data: any;
  filter?: any;
  order: PaginationOrderEnum;
  page: number;
  perPage: number;
  sortBy: Record<string, number>[];
  totalItems: number;
  totalPages: number;
  
}
