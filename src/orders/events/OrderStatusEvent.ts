import {Order, OrderDocument} from "../schemas/order.schema";
import {OrderStatusEnum} from "../enums/order.status.enum";

export class OrderStatusEvent  {
  order: OrderDocument;
  userId: string;
  newStatus: OrderStatusEnum;
  
  
  constructor(data: OrderStatusEvent) {
    this.order = data.order;
    this.userId = data.userId;
    this.newStatus = data.newStatus;
  }
}
