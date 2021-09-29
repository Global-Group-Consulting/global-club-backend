import { PartialType } from '@nestjs/swagger';
import { CreateManualMovementDto } from './create-manual-movement.dto';

export class UseMovementDto extends PartialType(CreateManualMovementDto) {}
