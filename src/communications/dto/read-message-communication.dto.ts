import {IsMongoId, IsNotEmpty} from "class-validator";
import {IsMongoIdArray} from "../../_basics/validators/IsMongoIdArray";

export class ReadMessageCommunicationDto {
  @IsNotEmpty()
  @IsMongoId()
  message: string
}
