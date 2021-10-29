import { FindException } from "../_exceptions/find.exception";
import { Document, Model, Query, QueryOptions } from 'mongoose';

export enum PaginationOrderEnum {
  ASC = "ASC",
  DESC = 'DESC'
}

export interface PaginationOptions {
  page?: number;
  perPage?: number;
  sortBy?: string[];
  order?: PaginationOrderEnum
}

export interface PaginatedResult<T = any> extends PaginationOptions {
  data: T;
  totalPages: number;
  totalItems: number
}

const defaultPaginationOptions: PaginationOptions = {
  page: 1,
  perPage: 30,
  sortBy: ["_id"],
  order: PaginationOrderEnum.ASC
}

export abstract class BasicService {
  abstract model: Model<any>;
  
  protected async findOrFail<T> (id: string): Promise<T> {
    const item = await this.model.findById(id)
    
    if (!item) {
      throw new FindException()
    }
    
    return item
  }
  
  /**
   * Make a find query, paginating the result
   *
   * @protected
   */
  protected async findPaginated<T> (filter: any,
    paginationOptions?: PaginationOptions,
    projection?: any, options?: QueryOptions): Promise<PaginatedResult<T[]>> {
    
    const sortOptions: PaginationOptions = Object.assign({}, defaultPaginationOptions, paginationOptions);
    
    const opts: QueryOptions = {
      skip: sortOptions.page <= 1 ? 0 : sortOptions.page * sortOptions.perPage,
      limit: sortOptions.perPage,
      sort: sortOptions.sortBy.reduce((acc, curr) => {
        acc[curr] = sortOptions.order === "ASC" ? 1 : -1;
        
        return acc
      }, {}),
      
    }
    
    // If there are other options, merge them
    if (options) {
      Object.assign(opts, options)
    }
    
    console.log("paginating data", opts)
    
    const count: number = await this.model.find(filter, projection, options).count().exec()
    const data: T[] = await this.model.find(filter, projection, opts).exec()
    
    return {
      ...sortOptions,
      totalItems: count,
      totalPages: Math.floor(count / paginationOptions.perPage),
      data
    }
  }
}
