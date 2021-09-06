import {Model, Schema} from "mongoose";
import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Movement, MovementDocument} from "./schemas/movement.schema";
import {CreateMovementDto} from './dto/create-movement.dto';
import {UpdateMovementDto} from './dto/update-movement.dto';
import {castToObjectId} from "../utilities/Formatters";

@Injectable()
export class MovementsService {
  constructor(@InjectModel(Movement.name) private movementModel: Model<MovementDocument>) {
  }
  
  create(createMovementDto: CreateMovementDto) {
    return 'This action adds a new movement';
  }
  
  async findAll(): Promise<Movement[]> {
    return this.movementModel.find().limit(10);
  }
  
  findOne(id: string) {
    return this.movementModel.find({userId: castToObjectId(id)}).limit(10);
  }
  
  update(id: number, updateMovementDto: UpdateMovementDto) {
    return `This action updates a #${id} movement`;
  }
  
  remove(id: string) {
    return `This action removes a #${id} movement`;
  }
}
