import {IsNotEmpty, IsNumber, IsString, Min} from "class-validator";
import {IsSemesterId} from "../../_basics/validators/IsSemesterId";

export class CreateManualMovementDto {
  @IsNumber()
  @Min(1)
  amountChange: number;
  
  @IsNotEmpty()
  @IsString()
  notes: string;
  
  @IsNotEmpty()
  @IsSemesterId()
  semesterId: string;
}
