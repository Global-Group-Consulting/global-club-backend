import { Order } from '../schemas/order.schema';
import { OrderStatusEnum } from '../enums/order.status.enum';

export class ReadOrderStatusesDto {
  _id: OrderStatusEnum;
  count: number
}
