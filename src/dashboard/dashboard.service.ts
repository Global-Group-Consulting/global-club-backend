import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BasicService } from '../_basics/BasicService';
import { MovementsService } from '../movements/movements.service';
import { AuthRequest } from '../_basics/AuthRequest';

@Injectable()
export class DashboardService extends BasicService {
  model: Model<any>
  
  constructor (protected config: ConfigService, private movementsService: MovementsService) {
    super()
  }
  
  readUserDashboard () {
    return this.movementsService.calcTotalBrites(this.authUser.id.toString())
  }
  
  readAdminDashboard () {
  
  }
}
