import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBasicAuth, ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ReadUserGroupsDto } from './dto/read-user-groups.dto';
import { PaginatedFilterUserDto } from './dto/paginated-filter-user.dto';
import { PaginatedResultUserDto } from './dto/paginated-result-user.dto';
import { ReadDto } from '../_basics/read.dto';
import { UserBasic } from './entities/user.basic.entity';
import { ReadUserDto } from './dto/read-user.dto';
import { User } from './schemas/user.schema';

@ApiBearerAuth()
@ApiBasicAuth("client-key")
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
  
  @ApiResponse({
    description: "Case when query param full is not provided or is false",
    type: UserBasic
  })
  @ApiResponse({
    description: "Case when query param full is true",
    status: 200,
    type: User
  })
  @Get(':id')
  findOne (@Param() params: ReadDto, @Query() query: ReadUserDto): Promise<UserBasic | User> {
    return this.usersService.findOne(params.id, query);
  }
  
  @Patch(':id')
  update (@Param() params: ReadDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(params.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
