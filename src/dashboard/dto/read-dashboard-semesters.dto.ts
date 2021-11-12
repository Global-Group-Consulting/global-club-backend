import { CalcTotalsDto } from '../../movements/dto/calc-totals.dto';
import { ApiProperty } from '@nestjs/swagger';

export class DashboardSemesterExpirations {
  usable: number;
  remaining: number;
  @ApiProperty({ type: Date })
  date: string
}

export class ReadDashboardSemestersDto {
  totalUsable: number;
  totalRemaining: number;
  expirations: DashboardSemesterExpirations[];
  semesters: CalcTotalsDto[]
}
