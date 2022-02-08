import {Order} from "../schemas/order.schema";

export class OrderCompletedEvent{
  order: Order;
  userId: string;
  
  constructor(data: OrderCompletedEvent) {
    this.order = data.order;
    this.userId = data.userId;
  }
}
