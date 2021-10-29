import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SystemLog, SystemLogDocument } from './schemas/system-logs.schema';
import { Model } from 'mongoose';
import { CreateSystemLogDto } from './dto/create-system-log.dto';

@Injectable()
export class SystemLogsService {
  constructor (@InjectModel(SystemLog.name) private systemLogModel: Model<SystemLogDocument>) {}
  
  async add (createSystemLogDto: CreateSystemLogDto): Promise<SystemLog> {
    let newLog = new this.systemLogModel(createSystemLogDto);
    
    let result;
    
    try {
      result = await newLog.save()
    } catch (er) {
      console.error(er)
    }
    
    return result ?? {
      _id: undefined
    }
  }
}
