import {MovementTypeEnum} from "../enums/movement.type.enum";

export class CreateMovementDto {
  amountChange: number;
  notes: string;
  semesterId: string;
  movementType: MovementTypeEnum;
}
