import { Model } from 'mongoose'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BasicService } from '../_basics/BasicService'
import { MovementsService } from '../movements/movements.service'
import { AuthRequest } from '../_basics/AuthRequest'
import { CalcTotalsDto, CalcTotalsGroup } from '../movements/dto/calc-totals.dto'
import { DashboardSemesterExpirations, ReadDashboardSemestersDto } from './dto/read-dashboard-semesters.dto'
import exp from 'constants'

@Injectable()
export class DashboardService extends BasicService {
  model: Model<any>
  
  constructor (protected config: ConfigService,
    private movementsService: MovementsService,
    @Inject('REQUEST') protected request: AuthRequest) {
    super()
  }
  
  async readUserDashboard (userId?: string): Promise<ReadDashboardSemestersDto> {
    const userIdToUse = userId || this.authUser.id.toString()
    const data: CalcTotalsDto[] = await this.movementsService.calcTotalBrites(userIdToUse, null, false)
    
    return this.movementsService.addMainReport(data, true, userIdToUse)
  }
  
  async readAdminDashboard (): Promise<ReadDashboardSemestersDto> {
    const data = await this.movementsService.calcTotalBrites('5fc4fa19a5a62400217a2f55', null, false)
    
    return this.movementsService.addMainReport(data)
  }
}
