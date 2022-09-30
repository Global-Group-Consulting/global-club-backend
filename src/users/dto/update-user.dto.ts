import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IsDate, IsDateString, IsOptional } from 'class-validator'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsDateString()
  clubPackStartAt: string
  
  @IsOptional()
  @IsDateString({})
  clubPackEndAt: string
}
