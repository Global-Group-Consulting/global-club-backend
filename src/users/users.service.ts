import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, userProjection } from './schemas/user.schema';
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
import { ReadUserDto } from './dto/read-user.dto';

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
  
  async findOne (id: string, query?: ReadUserDto): Promise<UserBasic | User> {
    const projection = query.full ? {
      password: 0 // avoid returning user password
    } : userBasicProjection;
    
    return await this.userModel.findById(id, projection).exec()
  }
  
  async update (id: string, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.findOrFail(id);
    
    // return only the changed keys;
    return this.userModel.findByIdAndUpdate(id, updateUserDto as any, {
      new: true,
      projection: Object.keys(updateUserDto).reduce((acc, key) => {
        acc[key] = 1;
        return acc
      }, {})
    })
  }
  
  remove (id: number) {
    return `This action removes a #${id} user`;
  }
  
  model: any;
}
