import { Movement } from "../schemas/movement.schema";
import { IsArray, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

import { PackEnum } from '../../packs/enums/pack.enum';

class CalcTotalPackDetails {
  total: number;
  forcedZero: boolean;
  subTotals: {
    interest_recapitalized: number;
    deposit_added: number;
    deposit_removed: number;
    deposit_transferred: number;
    deposit_used: number;
  }
}

class CalcTotalPacks {
  @ApiProperty({
    required: false,
    type: CalcTotalPackDetails,
  })
  _none?: CalcTotalPackDetails
  
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
  
  total: number;
  totalUsed: number;
  totalEarned: number;
  
  @ApiProperty({
    type: Date
  })
  expiresAt: string
  
  @ApiProperty({
    type: Date
  })
  usableFrom: string
  
  usableNow: boolean
  
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
}
