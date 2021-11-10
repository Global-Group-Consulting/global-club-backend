import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserBasic, UserBasicDocument } from './schemas/user-basic.schema';
import { Model } from 'mongoose';
import { BasicService, PaginatedResult } from '../_basics/BasicService';
import { User } from './entities/user.entity';
import { ReadUserGroupsDto } from './dto/read-user-groups.dto';
import { PaginatedFilterUserDto } from './dto/paginated-filter-user.dto';
import { FindAllUserFilterMap } from './dto/filters/find-all-user.filter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService extends BasicService {
  constructor (@InjectModel(UserBasic.name) private userModel: Model<UserBasicDocument>, protected config: ConfigService) {
    super();
    this.model = userModel
  }
  
  create (createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }
  
  async findAll (paginationDto: PaginatedFilterUserDto): Promise<PaginatedResult<User[]>> {
    const query = this.prepareQuery((paginationDto.filter ?? {}), FindAllUserFilterMap)
  
    return await this.findPaginated<User>({
      ...query,
      gold: true,
    }, paginationDto)
  }
  
  async groupBy (field: keyof User): Promise<ReadUserGroupsDto[]> {
    return this.userModel.aggregate<ReadUserGroupsDto>([
      {
        $match: { gold: true }
      },
      {
        $group: {
          _id: "$" + field,
          count: { $sum: 1 }
        }
      }
    ]).exec()
  }
  
  findOne (id: number) {
    return `This action returns a #${id} user`;
  }
  
  update (id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  
  remove (id: number) {
    return `This action removes a #${id} user`;
  }
  
  model: any;
}
