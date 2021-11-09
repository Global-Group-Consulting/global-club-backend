import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from "@nestjs/swagger";
import { PaginatedFilterDto } from '../_basics/pagination.dto';
import { User } from './entities/user.entity';
import { PaginatedResult } from '../_basics/BasicService';
import { ReadUserGroupsDto } from './dto/read-user-groups.dto';
import { PaginatedFilterUserDto } from './dto/paginated-filter-user.dto';
import { PaginatedResultUserDto } from './dto/paginated-result-user.dto';

@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}
  
  @Post()
  create (@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Get()
  findAll (@Query() paginationDto: PaginatedFilterUserDto): Promise<PaginatedResultUserDto> {
    return this.usersService.findAll(paginationDto);
  }
  
  @Get("/groups")
  readGroups (): Promise<ReadUserGroupsDto[]> {
    return this.usersService.groupBy("role");
  }
  
  @Get(':id')
  findOne (@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  
  @Patch(':id')
  update (@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
