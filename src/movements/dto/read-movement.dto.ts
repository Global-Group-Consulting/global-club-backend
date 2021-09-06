import {Types} from "mongoose"
import {IsMongoId} from "class-validator";

type ObjectId = Types.ObjectId

export class ReadMovementDto {
  @IsMongoId({
    message: "The provided ID is invalid"
  })
  id: string
}
