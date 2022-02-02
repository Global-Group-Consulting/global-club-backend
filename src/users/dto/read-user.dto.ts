import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ToBoolean } from '../../_basics/transformers/toBoolean';

export class ReadUserDto {
  @ApiProperty({
    required: false,
    default: false,
    description: "Returns the full user dataa nd not only the basic data"
  })
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  full: boolean
}
