import {PackEnum} from "../../packs/enums/pack.enum";
import {OrderStatusEvent} from "./OrderStatusEvent";
import {Order} from "../schemas/order.schema";

export class OrderPackChangeCompletedEvent {
  order: Order;
  userId: string;
  newPack: PackEnum;
  changeCost: number
  
  constructor(data: OrderPackChangeCompletedEvent) {
    this.order = data.order;
    this.userId = data.userId;
    this.newPack = data.newPack;
    this.changeCost = data.changeCost;
  }
}
