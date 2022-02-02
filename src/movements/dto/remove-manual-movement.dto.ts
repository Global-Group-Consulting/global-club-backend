import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import {IsSemesterId} from "../../_basics/validators/IsSemesterId";
import { PackEnum } from '../../packs/enums/pack.enum';

export class RemoveManualMovementDto {
  @IsNumber()
  @Min(1)
  amountChange: number;
  
  @IsNotEmpty()
  @IsString()
  notes: string;
  
  @IsNotEmpty()
  @IsSemesterId()
  semesterId: string;
  
  @IsNotEmpty()
  @IsEnum(PackEnum)
  clubPack: PackEnum;
}
