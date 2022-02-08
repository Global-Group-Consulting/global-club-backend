import {Order} from "../schemas/order.schema";

export class OrderCancelledEvent{
  order: Order;
  userId: string;
  reason: string;
  
  constructor(data: OrderCancelledEvent) {
    this.order = data.order;
    this.userId = data.userId;
    this.reason = data.reason;
  }
}
