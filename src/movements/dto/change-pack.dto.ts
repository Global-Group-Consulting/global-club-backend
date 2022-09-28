import { IsNotEmpty, IsEnum } from 'class-validator'
import { PackEnum } from '../../packs/enums/pack.enum'

export class ChangePackDto {
  @IsNotEmpty()
  @IsEnum(PackEnum)
  newPack: PackEnum
}
