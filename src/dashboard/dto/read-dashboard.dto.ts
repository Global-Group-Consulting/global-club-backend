import { IsMongoId, IsOptional } from 'class-validator';
import { IsMongoIdArrayConstraint } from '../../_basics/validators/IsMongoIdArray';

export class ReadDashboardDto {
  @IsOptional()
  @IsMongoId()
  userId: string
}
