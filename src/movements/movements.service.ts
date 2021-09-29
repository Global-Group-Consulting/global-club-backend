import {REQUEST} from "@nestjs/core";
import {Model} from "mongoose";
import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Movement, MovementDocument} from "./schemas/movement.schema";
import {AuthRequest} from "../_basics/AuthRequest";
import {User} from "../users/entities/user.entity";
import {UseMovementDto} from './dto/use-movement.dto';
import {CreateManualMovementDto} from './dto/create-manual-movement.dto';
import {RemoveManualMovementDto} from "./dto/remove-manual-movement.dto";
import {MovementTypeEnum} from "./enums/movement.type.enum";

@Injectable()
export class MovementsService {
  constructor(@InjectModel(Movement.name) private movementModel: Model<MovementDocument>,
              @Inject(REQUEST) private request: AuthRequest) {
  }
  
  get authUser(): User {
    return this.request.auth.user;
  }
  
  manualAdd(userId: string, createMovementDto: CreateManualMovementDto) {
    const newMovement = new this.movementModel({
      ...createMovementDto,
      userId: userId,
      createdBy: this.authUser.id,
      movementType: MovementTypeEnum.DEPOSIT_ADDED
    })
    
    return newMovement.save()
  }
  
  async findAllForUser(id: string): Promise<Movement[]> {
    return this.movementModel.find({userId: id});
  }
  
  async use(userId: string, useMovementDto: UseMovementDto) {
    await this.checkIfHasEnough(userId, useMovementDto.amountChange)
    
    return `This action updates a #${userId} movement`;
  }
  
  async manualRemove(userId: string, removeMovementDto: RemoveManualMovementDto) {
    await this.checkIfHasEnough(userId, removeMovementDto.amountChange)
    
    const newMovement = new this.movementModel({
      ...removeMovementDto,
      userId: userId,
      createdBy: this.authUser.id,
      movementType: MovementTypeEnum.DEPOSIT_REMOVED
    })
    
    return newMovement.save()
  }
  
  async checkIfHasEnough(userId: string, amount: number) {
    const usableFrom = new Date();
    const expiresAt = new Date(new Date().setHours(23, 59, 59))
    
    const match = {
      '$match': {
        'userId': userId,
        'usableFrom': {
          '$lte': usableFrom
        },
        'expiresAt': {
          '$gte': expiresAt
        }
      }
    }
    
    const convertToNegative = {
      '$convert': {
        'input': {
          '$concat': [
            '-', {
              '$convert': {
                'input': '$amountChange',
                'to': 'string'
              }
            }
          ]
        },
        'to': 'double'
      }
    }
    
    const group = {
      '$group': {
        '_id': {
          'semesterId': '$semesterId'
        },
        'total': {
          '$sum': {
            '$switch': {
              'branches': [
                {
                  'case': {'$eq': ['$movementType', MovementTypeEnum.DEPOSIT_ADDED]},
                  'then': '$amountChange'
                }, {
                  'case': {'$eq': ['$movementType', MovementTypeEnum.DEPOSIT_REMOVED]},
                  'then': convertToNegative
                }, {
                  'case': {'$eq': ['$movementType', MovementTypeEnum.DEPOSIT_COLLECTED]},
                  'then': convertToNegative
                }, {
                  'case': {'$eq': ['$movementType', MovementTypeEnum.DEPOSIT_TRANSFERRED]},
                  'then': convertToNegative
                }, {
                  'case': {'$eq': ['$movementType', MovementTypeEnum.INTEREST_RECAPITALIZED]},
                  'then': '$amountChange'
                }
              ],
              'default': 0
            }
          }
        },
        'movements': {
          '$push': '$$ROOT'
        }
      }
    }
    
    const result = await this.movementModel.aggregate([
        match,
        group
      ]
    )
    
    // TODO:: una volta recuperato i dati, controllare se si posseggono abbastanza brite
    
    // TODO:: quando si riscuote,fare la somma per tutti i semestri, e per ciascuno,
    // riscuotere partendo dal più vecchio
  }
}
