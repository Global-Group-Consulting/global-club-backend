import { IsArray, IsEnum, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { CommunicationTypeEnum } from "../enums/communication.type.enum";
import { UserBasic } from "../../users/entities/user.basic.entity";
import { Type } from "class-transformer";
import { Attachment } from "../../_schemas/attachment.schema";
import { OrderStatusEnum } from '../../orders/enums/order.status.enum';

interface MessageOrderProduct {
  qta: number;
  price: number,
  product: {
    _id: any,
    title: string
  }
}

export class CreateCommunicationDto {
  @IsNotEmpty()
  @IsEnum(CommunicationTypeEnum)
  type: CommunicationTypeEnum
  
  @IsNotEmpty()
  message: string
  
  @IsOptional()
  @IsArray()
  @Type(() => Attachment)
  @ValidateNested({ each: true })
  attachments?: Attachment[]
  
  @IsOptional()
  title: string
  
  messageData: {
    orderStatus: OrderStatusEnum,
    orderProducts: MessageOrderProduct[]
  }
  
  // The sender will be automatically set by the auth user
  /*@IsOptional()
  sender: UserBasic*/
  
  // Required only when the type is NEWSLETTER | COMMUNICATION | CHAT
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserBasic)
  receivers?: UserBasic[]
  
  // Required only when the type is NEWSLETTER | COMMUNICATION | CHAT
  @IsOptional()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => UserBasic)
  watchers?: UserBasic[]
}
