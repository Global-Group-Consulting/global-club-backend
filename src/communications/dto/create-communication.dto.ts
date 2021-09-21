import {IsArray, IsEnum, IsNotEmpty, IsOptional, ValidateNested} from "class-validator";
import {CommunicationTypeEnum} from "../enums/communication.type.enum";
import {UserBasic} from "../../users/entities/user.basic.entity";
import {Type} from "class-transformer";

export class CreateCommunicationDto {
  @IsNotEmpty()
  @IsEnum(CommunicationTypeEnum)
  type: CommunicationTypeEnum
  
  @IsNotEmpty()
  message: string
  
  @IsOptional()
  title: string
  
  // Required only when the type is NEWSLETTER | COMMUNICATION | CHAT
  @IsOptional()
  sender: UserBasic
  
  // Required only when the type is NEWSLETTER | COMMUNICATION | CHAT
  @IsOptional()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => UserBasic)
  receivers: UserBasic[]
  
  // Required only when the type is NEWSLETTER | COMMUNICATION | CHAT
  @IsOptional()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => UserBasic)
  watchers: UserBasic[]
}
