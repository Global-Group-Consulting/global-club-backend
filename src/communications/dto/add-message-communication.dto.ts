import { Attachment } from "../../_schemas/attachment.schema";
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { OrderStatusEnum } from '../../orders/enums/order.status.enum';
import { Product } from '../../products/schemas/product.schema';
import { OrderProduct } from '../../orders/schemas/order-product';

export class AddMessageCommunicationDto {
  @IsNotEmpty()
  message: string = ""
  
  @IsOptional()
  @IsArray()
  @Type(() => Attachment)
  @ValidateNested({ each: true })
  attachments?: Attachment[]
  
  messageData?: {
    orderStatus?: OrderStatusEnum
    productUpdate?: {
      product: Pick<Product, "_id" | "title">,
      diff: any,
      originalData: Partial<OrderProduct>
    }
  }
}
