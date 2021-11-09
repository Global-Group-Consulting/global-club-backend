import { PaginatedResult, PaginationOrderEnum } from './BasicService';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Max, Min, } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginatedFilterDto<T = any> {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (value instanceof Array) ? value : [value])
  sortBy?: string[] = ["_id"];
  
  @IsOptional()
  @IsString()
  @IsEnum(PaginationOrderEnum)
  order?: PaginationOrderEnum = PaginationOrderEnum.ASC;
  
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  @Min(1)
  page?: number = 1;
  
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  @Max(100)
  @Min(10)
  perPage?: number = 30;
  
  // @IsOptional()
  /*@Transform(({ value }) => (value instanceof Array) ? value : [value])
  @IsArray()
  filter?: string[]*/
}
