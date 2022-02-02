import { Movement } from "../schemas/movement.schema";
import { IsArray, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

import { PackEnum } from '../../packs/enums/pack.enum';

export class CalcTotalPackDetailsSupTotals {
  interest_recapitalized: number;
  deposit_added: number;
  deposit_removed: number;
  deposit_transferred: number;
  deposit_used: number;
}

export class CalcTotalPackDetails {
  @ApiProperty({
    description: "Refers to the total amount of money the user has for that semester or pack, but does not take in consideration all the various usability conditions of the different packs."
  })
  totalRemaining: number;
  
  @ApiProperty({
    description: "refers to the total amount of money the user has AND TAKES in consideration all the various packs conditions. For this reasons, this amount could equal or less than “totalRemaining”."
  })
  totalUsable: number;
  totalUsed: number;
  totalEarned: number;
  forcedZero: boolean;
  subTotals: CalcTotalPackDetailsSupTotals
}

class CalcTotalPacks {
  @ApiProperty({
    required: false,
    type: CalcTotalPackDetails,
  })
  [PackEnum.NONE]?: CalcTotalPackDetails
  
  @ApiProperty({
    name: PackEnum.BASIC,
    type: CalcTotalPackDetails,
    required: false
  })
  [PackEnum.BASIC]?: CalcTotalPackDetails
  
  @ApiProperty({
    name: PackEnum.FAST,
    type: CalcTotalPackDetails,
    required: false
  })
  [PackEnum.FAST]?: CalcTotalPackDetails
  
  @ApiProperty({
    name: PackEnum.PREMIUM,
    type: CalcTotalPackDetails,
    required: false
  })
  [PackEnum.PREMIUM]?: CalcTotalPackDetails
}

export class CalcTotalsDto {
  semesterId: string;
  
  @ApiProperty({
    description: "Refers to the total amount of money the user has for that semester or pack, but does not take in consideration all the various usability conditions of the different packs."
  })
  totalRemaining: number;
  
  @ApiProperty({
    description: "refers to the total amount of money the user has AND TAKES in consideration all the various packs conditions. For this reasons, this amount could equal or less than “totalRemaining”."
  })
  totalUsable: number;
  
  @ApiProperty({})
  totalUsed: number;
  
  @ApiProperty({})
  totalEarned: number;
  
  @ApiProperty({
    type: Date
  })
  expiresAt: string
  
  @ApiProperty({
    type: Date
  })
  usableFrom: string
  
  @ApiProperty({})
  usableNow: boolean
  
  @ApiProperty({})
  packs: CalcTotalPacks
}

export class CalcTotalsGroup {
  _id: {
    semesterId: string
  }
  
  total: number;
  totalUsed: number;
  totalEarned: number;
  
  interest_recapitalized: number;
  deposit_added: number;
  deposit_removed: number;
  deposit_transferred: number;
  deposit_used: number;
  
  movements: Movement[]
}
