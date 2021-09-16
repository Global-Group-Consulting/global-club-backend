import {IsMongoId} from "class-validator";

export class ReadDto {
  @IsMongoId({
    message: "The provided ID is invalid"
  })
  id: string
}
