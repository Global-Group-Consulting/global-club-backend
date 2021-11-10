import { FindException } from "../_exceptions/find.exception";
import { Model, QueryOptions } from 'mongoose';
import { FilterMap, FilterOptions } from './FilterMap.dto';
import { ConfigService } from '@nestjs/config';

export enum PaginationOrderEnum {
  ASC = "ASC",
  DESC = 'DESC'
}

export interface PaginationOptions {
  page: number;
  perPage: number;
  sortBy: string[];
  order: PaginationOrderEnum
  filter?: any
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
  protected abstract config: ConfigService;
  
  /*protected constructor (protected config: ConfigService) {
  
  }*/
  
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
  protected async findPaginated<T> (filter: Partial<T>,
    paginationOptions?: Partial<PaginationOptions>,
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
  
    const filters = { ...filter };
  
    /*  if (paginationOptions.filter) {
        paginationOptions.filter.forEach(filter => {
          const blocks = filter.split(":");
          const key: string = blocks[0].trim();
          const originalValue: string = blocks[1].trim();
          let value: any = originalValue;
          
          if (originalValue.startsWith("+")) {
            value = +originalValue.replace("+", "")
          }
          
          // if prop already exists, ignore it
          if (!key || !value || filters.hasOwnProperty(key)) {
            return
          }
          
          filters[key] = value
        })
      }
      */
    let count: number = 0;
    const data: T[] = await this.model.find(filters, projection, opts).exec()
  
    // If the result length is higher or equal to the perPageLimit,
    // count the total results, otherwise use the data.length as a counter.
    if (data.length >= sortOptions.perPage) {
      count = await this.model.find(filters, projection, options).count().exec()
    } else {
      count = data.length
    }
  
    const toReturn = {
      ...sortOptions,
      totalItems: count,
      totalPages: Math.floor(count / paginationOptions.perPage) || 1,
      data
    }
  
    // add executed query to response only if not in development
    if (this.config.get("NODE_ENV") !== "production") {
      toReturn["query"] = this.prepareQueryToReturn(filters)
    }
  
    return toReturn
  }
  
  protected prepareQuery<T = any> (filters: any, filtersMap: FilterMap<T>): T {
    const toReturn: any = {}
  
    if (!filters) {
      return toReturn
    }
  
    Object.keys(filtersMap).forEach(key => {
      let value = filters[key]
      let filterOptions: FilterOptions = filtersMap[key]
    
      if (value === undefined) {
        return
      }
    
      if (filterOptions.hasOwnProperty("castValue")) {
        value = filterOptions.castValue(value);
      }
    
      if (filterOptions.hasOwnProperty("query")) {
        value = filterOptions.query(value)
      }
    
      toReturn[key] = value
    })
    
    return toReturn
  }
  
  private prepareQueryToReturn (filters: Record<string, any>) {
    return Object.entries(filters).reduce((acc, curr) => {
      const key = curr[0];
      let value = curr[1];
      
      if (value instanceof RegExp) {
        value = value.toString()
      }
      
      acc[key] = value
      
      return acc
    }, {})
  }
}
