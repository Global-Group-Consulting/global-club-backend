import {MovementTypeEnum} from "../enums/movement.type.enum";

export class RecapitalizationDto {
  userId: string;
  semesterId: string;
  amountChange: number;
  fromUUID: string;
}
