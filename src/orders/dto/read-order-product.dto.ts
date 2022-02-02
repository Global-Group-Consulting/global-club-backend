import { Order } from '../schemas/order.schema';
import { OrderStatusEnum } from '../enums/order.status.enum';
import { IsMongoId } from 'class-validator';

export class ReadOrderProductDto {
  @IsMongoId({
    message: "The provided ID is invalid"
  })
  id: string
  
  @IsMongoId({
    message: "The provided ID is invalid"
  })
  productId: string
}
