import {Model} from 'mongoose';
import {HttpException, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Movement, MovementDocument} from './schemas/movement.schema'
import {AuthRequest} from '../_basics/AuthRequest'
import {UseMovementDto} from './dto/use-movement.dto'
import {CreateManualMovementDto} from './dto/create-manual-movement.dto'
import {RemoveManualMovementDto} from './dto/remove-manual-movement.dto'
import {MovementTypeEnum, MovementTypeInList, MovementTypeOutList} from './enums/movement.type.enum'
import {castToFixedDecimal, castToObjectId} from '../utilities/Formatters'
import {
  CalcTotalPackDetails,
  CalcTotalPackDetailsSupTotals,
  CalcTotalsDto,
  CalcTotalsGroup
} from './dto/calc-totals.dto'
import {WithdrawalException} from './exceptions/withdrawal.exception'
import {UpdateException} from '../_exceptions/update.exception'
import {BasicService} from '../_basics/BasicService';
import {ConfigService} from '@nestjs/config';
import {calcBritesUsage} from './utils/movements.utils';
import {PackEnum} from '../packs/enums/pack.enum';
import {FindAllMovementsFilterMap} from './dto/filters/find-all-movements.filter';
import {PaginatedFilterMovementDto} from './dto/paginated-filter-movement.dto';
import {PaginatedResultMovementDto} from './dto/paginated-result-movement.dto';
import {User, UserDocument} from '../users/schemas/user.schema';
import {RecapitalizationDto} from "./dto/recapitalization.dto";

@Injectable()
export class MovementsService extends BasicService {
  model: Model<MovementDocument>
  
  constructor(@InjectModel(Movement.name) private movementModel: Model<MovementDocument>,
              @InjectModel(User.name) private userModel: Model<UserDocument>,
              protected config: ConfigService,
              @Inject('REQUEST') protected request: AuthRequest) {
    super()
    
    this.model = movementModel
  }
  
  async findAll(userId: string, queryData: PaginatedFilterMovementDto): Promise<PaginatedResultMovementDto> {
    const query: any = this.prepareQuery({
      ...queryData.filter,
    }, FindAllMovementsFilterMap)
    
    query.userId = castToObjectId(userId);
    
    return this.findPaginated<Movement>(query, queryData)
  }
  
  async manualAdd (userId: string, createMovementDto: CreateManualMovementDto): Promise<Movement> {
    const user = await this.userModel.findById(userId).exec();
  
    if (!user) {
      throw new HttpException('Can\'t find the requested user', 400);
    }
  
    const newMovement = new this.movementModel({
      ...createMovementDto,
      userId: userId,
      createdBy: this.authUser.id,
      movementType: MovementTypeEnum.DEPOSIT_ADDED
    });
  
    return newMovement.save();
  }
  
  async manualRemove(userId: string, removeMovementDto: RemoveManualMovementDto): Promise<Movement> {
    const user = await this.userModel.findById(userId).exec();
  
    if (!user) {
      throw new HttpException('Can\'t find the requested user', 400);
    }
    
    // await this.checkIfEnough(userId, removeMovementDto.amountChange, removeMovementDto.semesterId)
    const totals = await this.calcTotalBrites(userId, removeMovementDto.semesterId);
    
    if(!totals || !totals[0].packs[removeMovementDto.clubPack] || totals[0][0].packs[removeMovementDto.clubPack].totalUsable < removeMovementDto.amountChange){
      throw new WithdrawalException("Importo superiore alla disponibilità dell'utente");
    }
    
    const newMovement = new this.movementModel({
      ...removeMovementDto,
      userId: userId,
      createdBy: this.authUser.id,
      movementType: MovementTypeEnum.DEPOSIT_REMOVED
    })
    
    return newMovement.save()
  }
  
  async use(userId: string, useMovementDto: UseMovementDto): Promise<Movement[]> {
    if (!userId) {
      throw new UpdateException('Missing userId')
    }
  
    if (!useMovementDto.amountChange) {
      throw new UpdateException("The amount must be higher than 1.")
    }
  
    const totalBySemesters = await this.checkIfEnough(userId, useMovementDto.amountChange)
    const movementsToCreate: Movement[] = []
  
    let remainingAmount = useMovementDto.amountChange
  
    // for each semester
    for (const semester of totalBySemesters) {
      const validPacks = [PackEnum.FAST, PackEnum.PREMIUM];
    
      // for each available pack
      for (const packKey of Object.keys(semester.packs)) {
      
        if (!validPacks.includes(packKey as PackEnum)) {
          continue;
        }
      
        const usable = semester.packs[packKey].totalUsable
        const toUse = remainingAmount >= usable ? usable : remainingAmount;
      
        remainingAmount -= toUse;
      
        if (toUse) {
          // Adds a movement for each pack
          const newMovement = new this.movementModel({
            amountChange: castToFixedDecimal(toUse),
            notes: useMovementDto.notes,
            semesterId: semester.semesterId,
            clubPack: packKey,
            userId: userId,
            createdBy: this.authUser.id,
            movementType: MovementTypeEnum.DEPOSIT_USED,
            order: useMovementDto.orderId
          })
        
          movementsToCreate.push(await newMovement.save())
        }
      }
    }
  
    return movementsToCreate;
  }
  
  /**
   * Allows to cancel a movement by completely removing it from the DB.
   * This must be used ONLY to cancel automatic movements, not those created manually
   */
  async cancel (movementId) {
    await this.movementModel.findByIdAndDelete(movementId)
  }
  
  async checkRemainingPerMonthFastUsage (userId: string) {
    const date = new Date()
    const query = {
      createdAt: {
        "$gte": new Date(date.getFullYear(), date.getMonth(), 1),
        "$lte": new Date(date.getFullYear(), new Date(new Date().setMonth(date.getMonth() + 1)).getMonth(), 0, 23, 59, 59)
      },
      usableFrom: {
        "$lte": date,
      },
      expiresAt: {
        "$gte": date
      },
      movementType: {
        "$in": MovementTypeOutList
      },
      clubPack: PackEnum.FAST
    }
    
    const movements = await this.movementModel.where(query).exec()
    const maxExpendable = 1000;
    
    // Max 2 movements per month
    if (movements.length > 1) {
      return 0
    }
    
    return movements.reduce((acc, curr) => {
      acc -= curr.amountChange;
      
      if (acc < 0) {
        acc = 0;
      }
      
      return acc
    }, maxExpendable)
  }
  
  /**
   * Based on all user's movements, group them by semester and for each semester,
   * calc the totals, considering each movement type. (must add or must remove)
   *
   * The semesters are fetched considering the usableFrom and expiresAt fields.
   */
  async calcTotalBrites (userId: string, semesterId?: string, excludeFutureUsability = true): Promise<CalcTotalsDto[]> {
    const usableFrom = new Date()
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
        /*'usableFrom': {
          '$lte': usableFrom
        },*/
        'expiresAt': {
          '$gte': expiresAt
        }
      }
    }
  
    // for each MovementType create an entry in the result to get the total only for that type
    const subTotals = {}
    for (const movementTypeEnumKey in MovementTypeEnum) {
      const value = MovementTypeEnum[movementTypeEnumKey];
    
      subTotals[value] = {
        $sum: {
          $cond: [{ '$eq': ['$movementType', value] }, "$amountChange", 0]
        }
      }
    }
  
    // excludeFutureUsability allow to limit the result to only the usableOnes or not
    if (excludeFutureUsability) {
      match.$match["usableFrom"] = {
        '$lte': usableFrom
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
          'semesterId': '$semesterId',
          'pack': "$clubPack"
        },
        'total': {
          '$sum': {
            '$round': [
              {
                '$switch': {
                  'branches': Object.values(MovementTypeEnum).map(enumValue => ({
                      'case': { '$eq': ['$movementType', enumValue] },
                      'then': MovementTypeOutList.includes(enumValue) ? convertToNegative : '$amountChange'
                    })
                  ),
                  'default': 0
                }
              }, 2]
          }
        },
        'totalUsed': {
          '$sum': {
            '$round': [
              {
                '$switch': {
                  'branches': Object.values(MovementTypeOutList).map(enumValue => ({
                      'case': { '$eq': ['$movementType', enumValue] },
                      'then': '$amountChange'
                    })
                  ),
                  'default': 0
                }
              }, 2]
          }
        },
        'totalEarned': {
          '$sum': {
            '$round': [
              {
                '$switch': {
                  'branches': Object.values(MovementTypeInList).map(enumValue => ({
                      'case': { '$eq': ['$movementType', enumValue] },
                      'then': '$amountChange'
                    })
                  ),
                  'default': 0
                }
              }, 2]
          }
        },
        ...subTotals,
        // Add movements only for fast pack so i can check different conditions
        'movements': {
          "$push": {
            "$cond": [
              { "$eq": ["$clubPack", "fast"] },
              "$$ROOT",
              "$$REMOVE"
            ]
      
          }
        }
      }
    }
  
    const toReturn: CalcTotalsGroup[] = await this.movementModel.aggregate([
        match,
        group,
        {
          "$sort": {
            "_id.semesterId": 1,
            "_id.pack": 1,
          }
        },
      ]
    )
  
    // Function that does a lot of stuff.
    // Touch at your own risk!!
    const reducedData = toReturn.reduce<Record<string, CalcTotalsDto>>((acc, el) => {
      const { totalUsed, totalEarned } = el;
      const usageData = calcBritesUsage(el._id.semesterId)
      const pack = el._id["pack"] || "_none";
      const semesterId = el._id.semesterId;
      //convert to fixed decimal to avoid JS bug with decimals
      let totalRemaining = castToFixedDecimal(el.total)
      let forcedZero = false
    
      // If doesn't exist yet, add it with default values.
      if (!acc[semesterId]) {
        acc[semesterId] = {
          semesterId,
          packs: {},
          totalRemaining: 0,
          totalEarned: 0,
          totalUsed: 0,
          totalUsable: 0,
          usableFrom: usageData.usableFrom.toUTCString(),
          usableNow: usageData.usableFrom.getTime() <= Date.now(),
          expiresAt: usageData.expiresAt.toUTCString(),
        }
      }
    
      // If totalRemaining is < than 0,
      // force the value to 0 and specify it in "forcedZero" variable
      if (totalRemaining < 0) {
        totalRemaining = 0;
        forcedZero = true
      }
    
      const currentPack: CalcTotalPackDetails = {
        totalRemaining,
        totalUsed: forcedZero ? 0 : castToFixedDecimal(totalUsed),
        // Must check the pack type to understand how much is really usable.
        totalUsable: (() => {
          let toReturn = 0
        
          switch (pack) {
            case PackEnum.PREMIUM:
            case "_none":
              // Premium has no limits
              toReturn = totalRemaining
              break;
          
            case PackEnum.FAST:
              // can use max 1000 per month
              // can use them with max 2 orders per month
              // can buy 1 gift card per month
              const perMonthAmountLimit = 1000;
              const perMonthExitsLimit = 2;
              const currMonthDate = new Date()
            
              currMonthDate.setDate(1);
              currMonthDate.setHours(0, 0, 0, 0)
            
              // Get current month exits. There can me max 2 (perMonthMovementsLimit)
              const currMonthExits = el.movements.filter(el => MovementTypeOutList.includes(el.movementType) && el.createdAt > currMonthDate)
              const currMonthUsed = currMonthExits.reduce((acc, curr) => acc += curr.amountChange, 0)
            
              if (currMonthExits.length < perMonthExitsLimit && currMonthUsed < perMonthAmountLimit) {
                toReturn += totalRemaining
              }
            
              break;
          }
        
          return toReturn
        })(),
        totalEarned: castToFixedDecimal(totalEarned),
        forcedZero,
        subTotals: Object.values(MovementTypeEnum).reduce<CalcTotalPackDetailsSupTotals>((acc, curr) => {
          acc[curr] = castToFixedDecimal(el[curr])
          return acc
        }, new CalcTotalPackDetailsSupTotals())
      }
    
      acc[semesterId].packs[pack] = currentPack;
      acc[semesterId].totalRemaining += currentPack.totalRemaining;
      acc[semesterId].totalUsable += currentPack.totalUsable
      acc[semesterId].totalUsed += currentPack.totalUsed
      acc[semesterId].totalEarned += currentPack.totalEarned
    
      return acc
    }, {})
  
    return Object.values(reducedData)
    // .filter(el => el.total > 0)
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
  
    const packsMap = {
      [PackEnum.NONE]: null,
      [PackEnum.UNSUBSCRIBED]: null,
      [PackEnum.FAST]: await this.checkRemainingPerMonthFastUsage(userId),
      [PackEnum.PREMIUM]: 0
    }
  
    const filteredSemesters: CalcTotalsDto[] = totalBySemesters.reduce((acc, curr) => {
      const data: CalcTotalsDto = {
        ...curr
      };
    
      const packs = {}
    
      Object.entries(curr.packs).forEach(entry => {
        const pack = entry[0];
        const value: CalcTotalPackDetails = entry[1]
      
        // use only the valid packs
        if (packsMap[pack] !== null) {
          // if the pack is fast, calc the remaining for this month
          if (pack === PackEnum.FAST) {
            const remaining = packsMap[pack];
          
            if (remaining) {
              packs[pack] = value
              packs[pack].totalUsable = remaining
            }
          } else {
            packs[pack] = value
          }
        }
      })
    
      data.packs = packs
    
      if (Object.keys(packs).length > 0) {
        acc.push(data)
      }
    
      return acc;
    }, [])
  
    // Total that is currently available to the user
    const totals = filteredSemesters.reduce((acc, curr) => {
      Object.entries(curr.packs).forEach(entry => {
        const value: CalcTotalPackDetails = entry[1]
      
        acc += value.totalUsable
      })
  
      return acc;
    }, 0)
  
    if (totals < amount) {
      throw new WithdrawalException("The requested amount is higher than the available amount.")
    }
  
    return filteredSemesters
  }
  
  async recapitalization(data: RecapitalizationDto) {
    const user = await this.userModel.findById(data.userId).exec();
    
    if (!user) {
      throw new HttpException('Can\'t find the requested user', 400);
    }
  
    
    const newMovement = new this.movementModel({
      ...data,
      notes: "Ricapitalizzazione",
      clubPack: user.clubPack ?? PackEnum.UNSUBSCRIBED,
      movementType: MovementTypeEnum.INTEREST_RECAPITALIZED
    });
    
    return newMovement.save();
  }
}
