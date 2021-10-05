import {Attachment} from "../../_schemas/attachment.schema";
import {IsArray, IsNotEmpty, IsOptional, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class AddMessageCommunicationDto {
  @IsNotEmpty()
  message: string = ""
  
  @IsOptional()
  @IsArray()
  @Type(() => Attachment)
  @ValidateNested({each: true})
  attachments?: Attachment[]
}
