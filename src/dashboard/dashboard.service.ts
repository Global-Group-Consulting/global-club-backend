import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BasicService } from '../_basics/BasicService';
import { MovementsService } from '../movements/movements.service';
import { AuthRequest } from '../_basics/AuthRequest';
import { CalcTotalsDto, CalcTotalsGroup } from '../movements/dto/calc-totals.dto';
import { DashboardSemesterExpirations, ReadDashboardSemestersDto } from './dto/read-dashboard-semesters.dto';
import exp from 'constants';

@Injectable()
export class DashboardService extends BasicService {
  model: Model<any>
  
  constructor (protected config: ConfigService,
               private movementsService: MovementsService,
               @Inject("REQUEST") protected request: AuthRequest) {
    super()
  }
  
  addMainReport (data: CalcTotalsDto[]): ReadDashboardSemestersDto {
    const expirations: Record<string, DashboardSemesterExpirations> = {}
    let totalUsable = 0;
    let totalRemaining = 0;
    
    data.forEach(el => {
      const date = el.expiresAt.toString();
      
      if (!el.usableNow) {
        return
      }
      
      if (!expirations[date]) {
        expirations[date] = {
          date: el.expiresAt,
          remaining: 0,
          usable: 0
        }
      }
      
      expirations[date].usable += el.totalUsable;
      expirations[date].remaining += el.totalRemaining;
      
      totalUsable += el.totalUsable;
      totalRemaining += el.totalRemaining
    })
  
    return {
      totalUsable,
      totalRemaining,
      expirations: Object.values(expirations),
      semesters: data
    }
  }
  
  async readUserDashboard (userId?: string): Promise<ReadDashboardSemestersDto> {
    const data: CalcTotalsDto[] = await this.movementsService.calcTotalBrites(userId || this.authUser.id.toString(), null, false)
    
    return this.addMainReport(data)
  }
  
  async readAdminDashboard (): Promise<ReadDashboardSemestersDto> {
    const data = await this.movementsService.calcTotalBrites("5fc4fa19a5a62400217a2f55", null, false)
    
    return this.addMainReport(data)
  }
}
