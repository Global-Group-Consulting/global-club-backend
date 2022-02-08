import {Order} from "../schemas/order.schema";
import {OrderCompletedEvent} from "./OrderCompletedEvent";
import {PackEnum} from "../../packs/enums/pack.enum";

export class OrderPackChangeCompletedEvent extends OrderCompletedEvent {
  newPack: PackEnum;
  changeCost: number
  
  constructor(data: OrderPackChangeCompletedEvent) {
    super(data);
    
    this.newPack = data.newPack;
  }
}
