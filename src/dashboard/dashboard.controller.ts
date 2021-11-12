import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from '../_basics/AuthRequest';
import { BasicController } from '../_basics/BasicController';
import { ReadDashboardSemestersDto } from './dto/read-dashboard-semesters.dto';

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
    Last there is a "packs" object which will contain all details for the remaining amount, based on the clubPack associated.<br>
    <ul>
      <li><strong>totalRemaining</strong>: refers to the total amount of money the user has for that semester or pack, but does not take in consideration all the various usability conditions of the different packs.</li>
      <li><strong>totalUsable</strong>: refers to the total amount of money the user has AND TAKES in consideration all the various packs conditions. For this reasons, this amount could equal or less than “totalRemaining”.</li>
    </ul>`
  })
  @Get("statistics")
  async read (@Req() req: AuthRequest): Promise<ReadDashboardSemestersDto> {
    if (this.dashboardService.userIsAdmin) {
      return this.dashboardService.readAdminDashboard()
    } else {
      return this.dashboardService.readUserDashboard()
    }
  }
}
