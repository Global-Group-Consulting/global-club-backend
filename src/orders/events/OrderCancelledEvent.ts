import {OrderStatusEvent} from "./OrderStatusEvent";

export class OrderCancelledEvent extends OrderStatusEvent{
  reason: string;
  
  constructor(data: OrderCancelledEvent & OrderStatusEvent) {
    super(data);
    
    this.reason = data.reason;
  }
}
