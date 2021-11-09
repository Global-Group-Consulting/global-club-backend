import { PaginatedFilterDto } from '../../_basics/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject, IsOptional,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../entities/user.entity';

class Filters implements Partial<User> {
  @ApiProperty({
    name: "filter[email]",
    // example: "filter[email]"
  })
  email?: string
  
  @ApiProperty({
    name: "filter[firstName]",
    // example: "filter[firstName]"
  })
  firstName?: string
  
  @ApiProperty({
    name: "filter[lastName]",
    // example: "filter[lastName]"
  })
  lastName?: string
}

export class PaginatedFilterUserDto extends PaginatedFilterDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Filters)
  filter?: Filters
}
