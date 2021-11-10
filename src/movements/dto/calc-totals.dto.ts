import { Movement } from "../schemas/movement.schema";
import { IsArray, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

import { PackEnum } from '../../packs/enums/pack.enum';

class CalcTotalPackDetails {
  total: number;
  forcedZero: boolean
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
  semesterId: string
  
  total: number
  
  @ApiProperty({
    type: Date
  })
  expiresAt: string
  
  @ApiProperty({
    type: Date
  })
  usableFrom: string
  
  packs: CalcTotalPacks
  
}

export class CalcTotalsGroup {
  _id: {
    semesterId: string
  }
  
  total: number
}
