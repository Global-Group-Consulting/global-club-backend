import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from '../_basics/AuthRequest';
import { BasicController } from '../_basics/BasicController';

@ApiBearerAuth()
@ApiTags("Dashboard")
@Controller('dashboard')
export class DashboardController extends BasicController {
  constructor (private readonly dashboardService: DashboardService) {
    super()
  }
  
  @ApiOperation({
    description: `A user portfolio is divided by semesters (January-June, July-December).<br>
    Each semester has a "total" key that indicates how much can still be used for that semester. There are also the expiration date and usable from date.<br>
    Last there is a "packs" object which will contain all details for the remaining amount, based on the clubPack associated `
  })
  @Get("statistics")
  async read (@Req() req: AuthRequest) {
    if (this.dashboardService.userIsAdmin) {
      return this.dashboardService.readAdminDashboard()
    } else {
      return this.dashboardService.readUserDashboard()
    }
  }
}
