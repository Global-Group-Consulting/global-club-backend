import {MovementType} from "../enums/MovementType";

export class CreateMovementDto {
  amountChange: number;
  notes: string;
  semesterId: string;
  movementType: MovementType;
}
