import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { castToNumber } from '../../utilities/Formatters';

export class CheckIfEnoughDto {
  @IsNotEmpty()
  @Transform((value) => castToNumber(value.value))
  amount: number
}
