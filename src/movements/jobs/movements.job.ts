import {Injectable} from "@nestjs/common";
import {JobMovementRecapitalizeDto} from "../dto/job-movement-recapitalize.dto";
import {MovementsService} from "../movements.service";

@Injectable()
export class MovementsJob {
  constructor(private movementsService: MovementsService) {
  }
  
  async recapitalize(data: JobMovementRecapitalizeDto) {
    const semesterId = (new Date()).getFullYear() + "_" + ((new Date()).getMonth() < 6 ? "1" : "2")
    
    return this.movementsService.recapitalization({
      amountChange: data.amount,
      userId: data.userId,
      semesterId,
    })
  }
}
