import {FindException} from "../_exceptions/find.exception";
import {Model, QueryOptions} from 'mongoose';
import {FilterMap, FilterOptions} from './FilterMap.dto';
import {ConfigService} from '@nestjs/config';
import {AuthRequest} from './AuthRequest';
import {User} from '../users/schemas/user.schema';
import {UserAclRolesEnum} from '../users/enums/user.acl.roles.enum';

export enum PaginationOrderEnum {
  ASC = "ASC",
  DESC = 'DESC'
}

export interface PaginationOptions {
  page: number;
  perPage: number;
  sortBy: Record<string, number>[];
  order: PaginationOrderEnum,
  limit?: number;
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
  sortBy: [{ "_id": 1 }],
  order: PaginationOrderEnum.ASC
}

export abstract class BasicService {
  abstract model: Model<any>;
  protected abstract config: ConfigService;
  protected abstract request: AuthRequest
  
  protected constructor () {
  
  }
  
  get authUser (): User {
    return this.request.auth.user
  }
  
  get userIsAdmin (): boolean {
    const validRoles = [UserAclRolesEnum.ADMIN, UserAclRolesEnum.SUPER_ADMIN, UserAclRolesEnum.CLUB_ADMIN]
    
    return this.request.auth.roles.some(
      (value) => validRoles.includes(value))
  }
  
  get userIsAgent (): boolean {
    const validRoles = [UserAclRolesEnum.AGENT]
    
    return this.request.auth.roles.some(
      (value) => validRoles.includes(value))
  }
  
  protected async findOrFail<T> (id: string, projection?: any, options?: any): Promise<T> {
    const item = await this.model.findById(id, projection, options)
    
    if (!item) {
      throw new FindException(null, 404)
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
  
    let limit = sortOptions.perPage;
  
    if (paginationOptions.limit && paginationOptions.limit < sortOptions.perPage) {
      limit = paginationOptions.limit
    }
  
    const opts: QueryOptions = {
      skip: sortOptions.page <= 1 ? 0 : (sortOptions.page - 1) * sortOptions.perPage,
      limit: limit,
      /* sort: sortOptions.sortBy.reduce((acc, curr) => {
         acc[curr] = sortOptions.order === "ASC" ? 1 : -1;
         
         return acc
       }, {}),*/
      sort: sortOptions.sortBy
    }
  
    // If there are other options, merge them
    if (options) {
      Object.assign(opts, options)
    }
  
    const filters = { ...filter };
    
    const data: T[] = await this.model.find(filters, projection, opts).exec()
    const count = await this.model.find(filters, projection, Object.assign({}, opts, {
      limit: null,
      skip: null
    })).count().exec()
  
    const toReturn = {
      ...sortOptions,
      totalItems: count,
      totalPages: Math.ceil(count / paginationOptions.perPage) || 1,
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
      let originalValue = filters[key]
      let filterOptions: FilterOptions = filtersMap[key]
      let filterKey = key
    
      if (value === undefined) {
        return
      }
  
      if (filterOptions.hasOwnProperty("castValue")) {
        value = filterOptions.castValue(value);
        originalValue = value;
      }
  
      if (filterOptions.hasOwnProperty("query")) {
        value = filterOptions.query(value)
      }
  
      if (filterOptions.hasOwnProperty("keyFormat")) {
        filterKey = filterOptions.keyFormat(key, originalValue)
      }
  
      toReturn[filterKey] = value
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
