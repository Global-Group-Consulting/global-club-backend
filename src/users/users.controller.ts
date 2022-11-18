import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiBasicAuth, ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ReadUserGroupsDto } from './dto/read-user-groups.dto'
import { PaginatedFilterUserDto } from './dto/paginated-filter-user.dto'
import { PaginatedResultUserDto } from './dto/paginated-result-user.dto'
import { ReadDto } from '../_basics/read.dto'
import { UserBasic } from './entities/user.basic.entity'
import { ReadUserDto } from './dto/read-user.dto'
import { User } from './schemas/user.schema'
import { UpdateUserPackDto } from './dto/update-user-pack.dto'
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto'
import { FindException } from '../_exceptions/find.exception'
import { pick } from 'lodash'

@ApiBearerAuth()
@ApiBasicAuth('client-key')
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor (private readonly usersService: UsersService) {}
  
  @Post()
  create (@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }
  
  @Get()
  findAll (@Query() paginationDto: PaginatedFilterUserDto): Promise<PaginatedResultUserDto> {
    return this.usersService.findAll(paginationDto)
  }
  
  @Get('/groups')
  readGroups (): Promise<ReadUserGroupsDto[]> {
    return this.usersService.groupBy('role')
  }
  
  @Get('/filterOptionsList')
  filterOptionsList (@Query() { value }: any): Promise<string[]> {
    return this.usersService.findForOptionsList(value)
  }
  
  @Get('/checkCardNum')
  async checkCardNum (@Query() query: { cardNum: string }) {
    const cardNum = query.cardNum
    const user = await this.usersService.findOneByCardNum(cardNum)
    
    return pick(user.toJSON(), ['_id', 'firstName', 'lastName', 'email', 'clubCardNumber'])
  }
  
  @ApiResponse({
    description: 'Case when query param full is not provided or is false',
    type: UserBasic
  })
  @ApiResponse({
    description: 'Case when query param full is true',
    status: 200,
    type: User
  })
  @Get(':id')
  findOne (@Param() params: ReadDto, @Query() query: ReadUserDto): Promise<UserBasic | User> {
    return this.usersService.findOne(params.id, query)
  }
  
  @Patch(':id/preferences')
  updatePreferences (@Param() params: ReadDto, @Body() preferences: UpdateUserPreferencesDto) {
    return this.usersService.updatePreferences(params.id, preferences)
  }
  
  @Patch(':id')
  update (@Param() params: ReadDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(params.id, updateUserDto)
  }
  
  @Patch(':id/pack')
  updatePack (@Param() params: ReadDto, @Body() updateUserPackDto: UpdateUserPackDto) {
    return this.usersService.updatePack(params.id, updateUserPackDto)
  }
  
  @Delete(':id')
  remove (@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
