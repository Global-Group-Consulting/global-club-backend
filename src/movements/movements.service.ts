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
import {castToFixedDecimal, castToObjectId} from "../utilities/Formatters";
import {CalcTotalsDto} from "./dto/calc-totals.dto";
import {WithdrawalException} from "./exceptions/withdrawal.exception";

@Injectable()
export class MovementsService {
  constructor(@InjectModel(Movement.name) private movementModel: Model<MovementDocument>,
              @Inject(REQUEST) private request: AuthRequest) {
  }
  
  get authUser(): User {
    return this.request.auth.user;
  }
  
  async manualAdd(userId: string, createMovementDto: CreateManualMovementDto): Promise<Movement> {
    const newMovement = new this.movementModel({
      ...createMovementDto,
      userId: userId,
      createdBy: this.authUser.id,
      movementType: MovementTypeEnum.DEPOSIT_ADDED
    })
    
    return newMovement.save()
  }
  
  async manualRemove(userId: string, removeMovementDto: RemoveManualMovementDto): Promise<Movement> {
    await this.checkIfEnough(userId, removeMovementDto.amountChange, removeMovementDto.semesterId)
    
    const newMovement = new this.movementModel({
      ...removeMovementDto,
      userId: userId,
      createdBy: this.authUser.id,
      movementType: MovementTypeEnum.DEPOSIT_REMOVED
    })
    
    return newMovement.save()
  }
  
  async findAllForUser(id: string): Promise<Movement[]> {
    return this.movementModel.find({userId: id});
  }
  
  async use(userId: string, useMovementDto: UseMovementDto): Promise<Movement[]> {
    const totalBySemesters = await this.checkIfEnough(userId, useMovementDto.amountChange)
    const semestersToUse: (CalcTotalsDto & { toWithdrawal?: number })[] = []
    const createdMovements: Movement[] = []
    
    let remainingAmount = useMovementDto.amountChange
    
    // Create a list of the semesters from which bust be withdrawal a certain amount.
    // This amount is specified in the property "toWithdrawal" created inside this cycle
    for (const semester of totalBySemesters) {
      const availableAmount = semester.total;
      
      if (remainingAmount === 0) {
        break;
      }
      
      // If the remainingAmount is higher than the availableAmount,
      // use all availableAmount and subtract it from remainingAmount
      // so at the next iteration, i'll understand how much must be removed from the next semester
      if (remainingAmount >= availableAmount) {
        semestersToUse.push({
          ...semester,
          toWithdrawal: castToFixedDecimal(availableAmount)
        })
        
        remainingAmount -= availableAmount;
      } else {
        // If the remainingAmount is lower thant the availableAmount,
        // withdrawal only the necessary amount.
        semestersToUse.push({
          ...semester,
          toWithdrawal: castToFixedDecimal(remainingAmount)
        })
        
        remainingAmount -= remainingAmount
        
        break;
      }
    }
    
    // For each semester stored in semestersToUse,
    // create a newMovement with the relative amount and with type "DEPOSIT_USED"
    for (const semester of semestersToUse) {
      // Adds a movement for each semester
      const newMovement = new this.movementModel({
        amountChange: semester.toWithdrawal,
        notes: useMovementDto.notes,
        semesterId: semester._id.semesterId,
        userId: userId,
        createdBy: userId,
        movementType: MovementTypeEnum.DEPOSIT_USED,
        order: useMovementDto.orderId
      })
      
      await newMovement.save()
      
      createdMovements.push(newMovement)
    }
    
    return createdMovements
  }
  
  
  /**
   * Based on all user's movements, group them by semester and for each semester,
   * calc the totals, considering each movement type. (must add or must remove)
   *
   * The semesters are fetched considering the usableFrom and expiresAt fields.
   */
  async calcTotalBrites(userId: string, semesterId?: string): Promise<CalcTotalsDto[]> {
    const usableFrom = new Date();
    const expiresAt = new Date(new Date().setHours(23, 59, 59))
    
    // Convert query for converting a positive number to a negative one.
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
    
    // Matching query for the aggregation
    const match = {
      '$match': {
        'userId': castToObjectId(userId),
        'usableFrom': {
          '$lte': usableFrom
        },
        'expiresAt': {
          '$gte': expiresAt
        }
      }
    }
    
    // If the semesterId argument is provided, includes it in the match query
    if (semesterId) {
      match.$match["semesterId"] = semesterId
    }
    
    // Grouping query
    const group = {
      '$group': {
        '_id': {
          'semesterId': '$semesterId'
        },
        'total': {
          '$sum': {
            '$round': [
              {
                '$switch': {
                  'branches': [
                    {
                      'case': {'$eq': ['$movementType', MovementTypeEnum.DEPOSIT_ADDED]},
                      'then': '$amountChange'
                    }, {
                      'case': {'$eq': ['$movementType', MovementTypeEnum.DEPOSIT_REMOVED]},
                      'then': convertToNegative
                    }, {
                      'case': {'$eq': ['$movementType', MovementTypeEnum.DEPOSIT_USED]},
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
              }, 2]
          }
          
        },
        /*'movements': {
          '$push': '$$ROOT'
        }*/
      }
    }
    
    const toReturn: CalcTotalsDto[] = await this.movementModel.aggregate([
        match,
        group,
        {
          "$sort": {
            "_id.semesterId": 1
          }
        }
      ]
    )
    
    return toReturn
      .map(el => {
        //convert to fixed decimal to avoid JS bug with decimals
        el.total = castToFixedDecimal(el.total)
        
        return el
      })
      .filter(el => el.total > 0)
  }
  
  /**
   * Based on the calcTotalBrites result, checks if the user has enough brites, based on the sum of all
   * available semesters.
   *
   * If a semesterId is provided asaa argument, use that inside the filter, so will
   * consider only the specified semester total.
   */
  async checkIfEnough(userId: string, amount: number, semesterId?: string): Promise<CalcTotalsDto[]> {
    const totalBySemesters = await this.calcTotalBrites(userId, semesterId);
    
    const totals = totalBySemesters.reduce((acc, curr) => acc + curr.total, 0)
    
    if (totals < amount) {
      throw new WithdrawalException("The requested amount is higher than the available amount.")
    }
    
    return totalBySemesters
  }
}
