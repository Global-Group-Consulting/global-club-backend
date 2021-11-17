import { PaginationOrderEnum } from './BasicService';
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min, } from 'class-validator';
import { Transform } from 'class-transformer';
import { ToArrayOfNumbers } from './transformers/toArray';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedFilterDto<T = any> {
  @ApiProperty({
    name: "sortBy[propName]",
    description: "Example: sortBy[_id]=1&sortBy[createdAt]=-1",
    type: Number,
    default: "1"
  })
  @IsOptional()
  @ToArrayOfNumbers()
  sortBy?: Record<string, number>[] = [{ "_id": 1 }];
  
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
