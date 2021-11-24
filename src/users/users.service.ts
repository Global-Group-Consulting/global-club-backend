import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { BasicService, PaginatedResult } from '../_basics/BasicService';
import { ReadUserGroupsDto } from './dto/read-user-groups.dto';
import { PaginatedFilterUserDto } from './dto/paginated-filter-user.dto';
import { FindAllUserFilterMap } from './dto/filters/find-all-user.filter';
import { ConfigService } from '@nestjs/config';
import { AuthRequest } from 'src/_basics/AuthRequest';
import { castToObjectId } from '../utilities/Formatters';
import { UserDocument } from './schemas/user.schema';
import { UserBasic, userBasicProjection } from './entities/user.basic.entity';

@Injectable()
export class UsersService extends BasicService {
  
  constructor (@InjectModel(User.name) private userModel: Model<UserDocument>,
               protected config: ConfigService,
               @Inject("REQUEST") protected request: AuthRequest) {
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
      }, paginationDto,
      userBasicProjection
    )
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
  
  async findOne (id: string): Promise<UserBasic> {
    return await this.userModel.findById(id, userBasicProjection).exec()
  }
  
  update (id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  
  remove (id: number) {
    return `This action removes a #${id} user`;
  }
  
  model: any;
}
