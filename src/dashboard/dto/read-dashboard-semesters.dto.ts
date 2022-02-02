import { CalcTotalsDto } from '../../movements/dto/calc-totals.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsBooleanString } from 'class-validator';
import { ToBoolean } from '../../_basics/transformers/toBoolean';

export class DashboardSemesterExpirations {
  @ApiProperty({
    description: "refers to the total amount of money the user has AND TAKES in consideration all the various packs conditions. For this reasons, this amount could equal or less than “totalRemaining”."
  })
  usable: number;
  
  @ApiProperty({
    description: "Refers to the total amount of money the user has for that semester or pack, but DOES NOT take in consideration all the various usability conditions of the different packs."
  })
  remaining: number;
  
  @ApiProperty({ type: Date })
  date: string
}

export class ReadDashboardSemestersDto {
  @ApiProperty({
    description: "Refers to the total amount of money the user has for that semester or pack, but DOES NOT take in consideration all the various usability conditions of the different packs."
  })
  totalRemaining: number;
  @ApiProperty({
    description: "refers to the total amount of money the user has AND TAKES in consideration all the various packs conditions. For this reasons, this amount could equal or less than “totalRemaining”."
  })
  totalUsable: number;
  expirations: DashboardSemesterExpirations[];
  semesters: CalcTotalsDto[]
}
