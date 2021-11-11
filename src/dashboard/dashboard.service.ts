import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BasicService } from '../_basics/BasicService';
import { MovementsService } from '../movements/movements.service';
import { AuthRequest } from '../_basics/AuthRequest';

@Injectable()
export class DashboardService extends BasicService {
  model: Model<any>
  
  constructor (protected config: ConfigService,
               private movementsService: MovementsService,
               @Inject("REQUEST") protected request: AuthRequest) {
    super()
  }
  
  async readUserDashboard () {
    const data = await this.movementsService.calcTotalBrites(this.authUser.id.toString(), null, false)
    return data
  }
  
  readAdminDashboard () {
    return this.movementsService.calcTotalBrites("5fc7ca57c2df820021c94959", null, false)
  }
}
