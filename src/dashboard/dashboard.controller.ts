import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from '../_basics/AuthRequest';
import { BasicController } from '../_basics/BasicController';

@ApiBearerAuth()
@ApiTags("Dashboard")
@Controller('dashboard')
export class DashboardController extends BasicController {
  constructor (private readonly dashboardService: DashboardService) {
    super()
  }
  
  @Get()
  async read (@Req() req: AuthRequest) {
    if (this.dashboardService.userIsAdmin) {
      return this.dashboardService.readAdminDashboard()
    } else {
      return this.dashboardService.readUserDashboard()
    }
  }
}
