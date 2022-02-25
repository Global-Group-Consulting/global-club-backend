import {Inject, Injectable, OnModuleInit, Scope} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {QueueService} from "../../queue/queue.service";
import {OrderStatusEvent} from "../events/OrderStatusEvent";
import {User, UserDocument} from "../../users/schemas/user.schema";
import {I18nService} from "nestjs-i18n";
import {EventEmitter2, OnEvent} from "@nestjs/event-emitter";

@Injectable()
export class OrderEventsListeners {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
              @Inject("LARAVEL_QUEUE") private queue: QueueService,
              private readonly nestEventEmitter: EventEmitter2,
              private readonly i18n: I18nService) {
  }
  
  @OnEvent("order.status.*")
  async handleOrderStatusChangeEvent(payload: OrderStatusEvent) {
    const user: User = await this.userModel.findById(payload.userId).exec();
    const order = payload.order.toJSON();
    
    await this.queue.dispatchEmail({
      to: user.email,
      from: process.env.MAIL_FROM,
      alias: "club-order-status-update",
      templateData: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
        newStatus: await this.i18n.translate("enums.OrderStatusEnum." + payload.newStatus),
        orderId: order._id,
        products: order.products,
        cancelReason: order.cancelReason,
        siteUrl: process.env.MAIL_SITE_URL,
        productLink: process.env.MAIL_SITE_URL + "/products",
        orderLink: process.env.MAIL_SITE_URL + "/order/" + order._id
      }
    });
  }
  
  @OnEvent("order.status.completed")
  async handleOrderStatusCompletedEvent(payload: OrderStatusEvent) {
    // first get the repayment products
    const repaymentProducts = payload.order.products.filter(orderProduct => orderProduct.repayment)
    
    if (repaymentProducts.length) {
      let amountToRepay = repaymentProducts.reduce((acc, curr) => {
        return acc + (curr.price * curr.qta)
      }, 0)
      
      if (amountToRepay) {
        // Convert to euro
        amountToRepay = amountToRepay / 2
      }
      
      const notes = `Rimborso ordine <a href="${process.env.MAIL_SITE_URL}/order/${payload.order._id}" target="_blank">#${payload.order._id}</a>`;
      
      await this.queue.dispatchRepayment({
        // importo aggiunto nel deposito come RIMBORSO - non genera provvigioni
        amount: amountToRepay,
        userId: payload.userId,
        notes
      })
    }
    
  }
}
