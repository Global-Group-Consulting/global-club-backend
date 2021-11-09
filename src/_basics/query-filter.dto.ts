import { Transform,  } from 'class-transformer';
import { IsArray } from 'class-validator';

export class QueryFilterDto {
  // @IsOptional()
  // @Transform(({ value }) => (value instanceof Array) ? value : [value])
  @IsArray()
  filter?: string[]
}
