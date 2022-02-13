import {Inject, Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {OrderCancelledEvent} from "../../orders/events/OrderCancelledEvent";
import {OrderPackChangeCompletedEvent} from "../../orders/events/OrderPackChangeCompletedEvent";
import {User, UserDocument} from "../schemas/user.schema";
import {UserClubPackEntity} from "../entities/user.clubPack.entity";
import {calcPackPremiumExpiration, castToObjectId} from "../../utilities/Formatters";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {QueueService} from "../../queue/queue.service";

@Injectable()
export class UsersOrderEventsListeners {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
              @Inject("LARAVEL_QUEUE") private queue: QueueService) {
  }
  
  @OnEvent('order.packChange.completed')
  async handleOrderPackChangeCompletedEvent(payload: OrderPackChangeCompletedEvent) {
    const user: UserDocument = await this.userModel.findById(payload.userId);
    
    user.clubPack = payload.newPack;
    user.clubPackChangeOrder = null;
    
    if (!user.clubPackHistory) {
      user.clubPackHistory = []
    }
    
    user.clubPackHistory.unshift(new UserClubPackEntity({
      orderId: castToObjectId(payload.order._id),
      pack: payload.newPack,
      cost: payload.order.packChangeCost,
      startsAt: new Date(),
      // 12 month from the date was activated
      endsAt: calcPackPremiumExpiration()
    }))
    
    await user.save()
  }
  
  @OnEvent("order.cancelled")
  async handleOrderCancelledEvent(payload: OrderCancelledEvent) {
    if (!payload.order.packChangeOrder) {
      return
    }
  
    const user: UserDocument = await this.userModel.findById(payload.userId);
  
    user.clubPackChangeOrder = null
  
    await user.save();
  }
}
