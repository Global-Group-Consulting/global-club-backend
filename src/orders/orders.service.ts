import {Model} from 'mongoose'
import {InjectModel} from '@nestjs/mongoose'
import {Inject, Injectable} from '@nestjs/common'
import {CreateOrderDto} from './dto/create-order.dto'
import {Order, OrderDocument} from './schemas/order.schema'
import {Product, ProductDocument} from '../products/schemas/product.schema'
import {AuthRequest} from '../_basics/AuthRequest'
import {FindException} from '../_exceptions/find.exception'
import {CommunicationsService} from '../communications/communications.service'
import {CommunicationTypeEnum} from '../communications/enums/communication.type.enum'
import {UpdateOrderStatusDto} from './dto/update-order-status.dto'
import {BasicService, PaginatedResult} from '../_basics/BasicService'
import {OrderStatusEnum} from './enums/order.status.enum'
import {MessageTypeEnum} from '../communications/enums/message.type.enum'
import {UpdateException} from '../_exceptions/update.exception'
import {MovementsService} from '../movements/movements.service'
import {Movement} from '../movements/schemas/movement.schema'
import {OrderProduct} from './schemas/order-product'
import {PaginatedFilterOrderDto} from './dto/paginated-filter-order.dto';
import {FindAllOrdersFilterMap} from './dto/filters/find-all-orders.filter';
import {ConfigService} from '@nestjs/config';
import {UpdateOrderProductDto} from './dto/update-order-product.dto';
import {castToObjectId} from '../utilities/Formatters';
import {diff} from 'deep-object-diff';
import {PackEnum} from "../packs/enums/pack.enum";
import {EventEmitter2} from "@nestjs/event-emitter";
import {OrderPackChangeCompletedEvent} from "./events/OrderPackChangeCompletedEvent";
import {OrderCancelledEvent} from "./events/OrderCancelledEvent";
import {Attachment} from "../_schemas/attachment.schema";
import {OrderStatusEvent} from "./events/OrderStatusEvent";


@Injectable()
export class OrdersService extends BasicService {
  model: Model<OrderDocument>
  
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private communicationService: CommunicationsService,
    private movementsService: MovementsService,
    protected config: ConfigService,
    protected eventEmitter: EventEmitter2,
    @Inject("REQUEST") protected request: AuthRequest
  ) {
    super()
    
    this.model = orderModel
  }
  
  private async checkProductsExistence (productIds: string[]): Promise<ProductDocument[]> {
    // Count the found results
    const productsExists = await this.productModel
      .where({ _id: { $in: productIds } })
      .exec()
    
    // If there is a difference between the found products and the order ones,
    // indicates there is some error, so can't proceed
    if (productsExists.length !== productIds.length) {
      throw new FindException('One or more products can\'t be found')
    }
    
    return productsExists
  }
  
  async create (createOrderDto: CreateOrderDto) {
    const newData: any = {
      ...createOrderDto,
      user: this.authUser
    }
  
    // Get the list of only ids
    const productIds: string[] = createOrderDto.products.reduce((acc, curr) => {
      acc.push(curr.id)
    
      return acc
    }, [])
  
    const productsExists: ProductDocument[] = await this.checkProductsExistence(productIds)
  
    let orderAmount = 0;
  
    // Map newData products to add for each one its actual price,
    // this to avoid problems if in the meanwhile the product price gets updated and the order is not yet completed.
    newData.products = newData.products.map((prod: OrderProduct) => {
      // The find method doesn't need any check because the productsExists already has been checked so the products
      // there are the same in newData.products
      prod.price = productsExists.find(p => p._id.toString() === prod.id).price
    
      // Update total amount for the order by calculating each product price * qta
      orderAmount += prod.price * prod.qta
  
      return prod
    })
  
    // Temporary generates the order, but don't save it yet
    const newOrder = new this.orderModel(newData)
  
    newOrder.amount = orderAmount;
  
    /* const messageProducts =
   */
    // Generates the communication associated with this order.
    const relatedCommunication = await this.communicationService.create({
      type: CommunicationTypeEnum.ORDER,
      title: `Ordine #${newOrder.id} del ${new Date().toLocaleString('it')}`,
      message: "order created",
      messageData: {
        orderStatus: OrderStatusEnum.PENDING,
        orderProducts: newOrder.products.reduce((acc, el) => {
          acc.push({
            qta: el.qta,
            price: el.price,
            product: {
              _id: castToObjectId(el.product),
              title: productsExists.find(prod => prod._id.toString() === el.product.toString()).title
            }
          });
        
          return acc
        }, [])
      }
    }, MessageTypeEnum.ORDER_CREATED)
  
    // Assign the communication id as a ref to the order
    newOrder.communication = relatedCommunication.id
  
    try {
      return await newOrder.save()
    } catch (e) {
      // If there is an error I remove the created communication
      await this.communicationService.remove(relatedCommunication.id)
    
      throw e
    }
  }
  
  async createPackChangeOrder(createOrderDto: CreateOrderDto, deposit: number, changeCost: number, contractFile: Attachment) {
    const newData: any = {
      ...createOrderDto,
      user: this.authUser,
      // indicates that the order changes the pack
      packChangeOrder: true
    }
  
    // get the right product from the db
    const product: Product = await this.productModel.where({
      packChange: true,
      packChangeTo: PackEnum.PREMIUM
    }).findOne().exec();
  
    if (!product) {
      throw new UpdateException("No product available for this pack", 500);
    }
  
    newData.products[0].id = product._id;
  
    // Temporary generates the order, but don't save it yet
    const newOrder = new this.orderModel(newData)
    newOrder.amount = 0;
    newOrder.packChangeCost = changeCost;
  
    // Generates the communication associated with this order.
    const relatedCommunication = await this.communicationService.create({
      type: CommunicationTypeEnum.ORDER,
      title: `Ordine #${newOrder.id} del ${new Date().toLocaleString('it')}`,
      message: "change pack order",
      messageData: {
        orderStatus: OrderStatusEnum.PENDING,
        orderProducts: [{
          qta: 1,
          price: 0,
          product: {
            _id: product._id,
            title: product.title
          }
        }],
        packChange: {
          totalDeposit: deposit,
          packCost: changeCost
        }
      }
    }, MessageTypeEnum.ORDER_CREATED)
    
    // Assign the communication id as a ref to the order
    newOrder.communication = relatedCommunication.id
    
    // Add initial message that indicates to the user what must be done to proceed
    await this.communicationService.addMessage(relatedCommunication.id, {
      message: "Gentile cliente,<br>per proseguire il cambio del pack, la preghiamo di firmare il contratto allegato e di caricare una scansione del documento. La invitiamo inoltre ad effettuare il pagamento indicato nel contratto e di caricare anche la ricevuta di avvenuto pagamento.",
      attachments: [contractFile],
    }, MessageTypeEnum.MESSAGE, true)
    
    try {
      return await newOrder.save()
    } catch (e) {
      // If there is an error I remove the created communication
      await this.communicationService.remove(relatedCommunication.id)
      
      throw e
    }
  }
  
  findAll(paginationDto: PaginatedFilterOrderDto): Promise<PaginatedResult<Order[]>> {
    const query: any = this.prepareQuery(paginationDto.filter, FindAllOrdersFilterMap)
    
    if (!this.userIsAdmin) {
      query["user.id"] = this.authUser.id.toString()
    }
  
    return this.findPaginated<Order>(query, paginationDto, {
      "user.permissions": 0
    }, {
      populate: ["products.product"]
    })
  }
  
  async groupBy (field: keyof Order): Promise<any> {
    return this.orderModel.aggregate([
      {
        $group: {
          _id: "$" + field,
          count: { $sum: 1 }
        }
      }
    ]).exec()
  }
  
  async findOne (id: string): Promise<Order> {
    const result = await this.orderModel
      .findById(
        id,
        {},
        {
          populate: ['products.product', 'communication'],
        },
      )
      .exec()
    
    return result
  }
  
  /*
  // For now i won't allow to update the products of an order.
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOrFail(id);
    
    const query = {
      "$push": {
        products: {
          "$each": updateOrderDto.products
        }
      }
    }
    
    await order.update(query);
    
    return this.orderModel.findById(id).exec();
  }*/
  
  async updateStatus (id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order: OrderDocument = await this.findOrFail<OrderDocument>(id, null, {
      populate: ['products.product', 'communication'],
    })
    const initialState = order.status;
    let newMovement: Movement[]
    let newMessageId: string
  
    // Avoid resetting the same status
    if (order.status === updateOrderStatusDto.status) {
      throw new UpdateException('This order already has the same status')
    }
  
    // Avoid changing status for a complete order.
    if (order.status === OrderStatusEnum.COMPLETED) {
      throw new UpdateException('This order is completed so the status can\'t be changed')
    }
    
    order.status = updateOrderStatusDto.status
    
    try {
      // Adds a message inside the communication for each state change
      const communication = await this.communicationService.addMessage(order.communication as any, {
        message: "status changed",
        messageData: {
          orderStatus: updateOrderStatusDto.status
        }
      }, MessageTypeEnum.ORDER_STATUS_UPDATE)
  
      // store the new message id so if necessary can remove it later.
      newMessageId = communication.messages[communication.messages.length - 1]._id.toString()
  
      if (order.status === OrderStatusEnum.IN_PROGRESS) {
        this.eventEmitter.emit("order.status.inProgress", new OrderStatusEvent({
          order,
          userId: order.user._id,
          newStatus: order.status
        }));
      }
  
      // If the order status is complete, generate the withdrawal movement
      if (order.status === OrderStatusEnum.COMPLETED) {
        // generate movement only if the amount is > 0
        if (order.amount) {
          newMovement = await this.movementsService.use((order.user._id || order.user.id), {
            amountChange: order.amount,
            orderId: order._id,
            notes: 'Completamento ordine #' + order._id.toString()
          })
        }
    
        // change the user pack eventually
        if (order.packChangeOrder) {
          const newPack = await this.productModel.findById(order.products[0].product) as ProductDocument;
          
          this.eventEmitter.emit("order.packChange.completed", new OrderPackChangeCompletedEvent({
            order,
            userId: order.user._id,
            newPack: newPack.packChangeTo,
            changeCost: order.packChangeCost,
          }));
        }
    
        this.eventEmitter.emit("order.status.completed", new OrderStatusEvent({
          order,
          userId: order.user._id,
          newStatus: order.status
        }));
      }
  
      if (order.status === OrderStatusEnum.CANCELLED) {
        order.cancelReason = updateOrderStatusDto.reason;
        
        this.eventEmitter.emit("order.status.cancelled", new OrderCancelledEvent({
          order,
          userId: order.user._id,
          newStatus: order.status,
          reason: updateOrderStatusDto.reason
        }));
      }
  
      const result = await order.save();
      await communication.save()
  
      return result.populate("communication")
    } catch (er) {
      // In case of error while applying the changes to the order,
      // remove the created message and eventually the created movement
  
      if (newMessageId) {
        await this.communicationService.removeMessage(newMessageId)
      }
  
      if (newMovement) {
        await this.movementsService.cancel(newMovement)
      }
  
      // Restore order status
      if (order.status !== initialState) {
        order.status = initialState;
        order.cancelReason = "";
        await order.save()
      }
  
      throw er
    }
  }
  
  async updateProduct (id: string, productId: string, updateOrderProductDto: UpdateOrderProductDto) {
    const orders: OrderDocument[] = await this.model.where({
      _id: castToObjectId(id),
      "products.product": castToObjectId(productId)
    }).exec()
  
    if (!orders || orders.length === 0) {
      throw new FindException('The order or product can\'t be found')
    }
  
    const order = orders[0];
    const prodIndex = order.products.findIndex(el => el.product.toString() === productId);
    const originalOrder = order.toJSON();
    const product: Product = await this.productModel.findById(originalOrder.products[prodIndex].product).exec()
  
    if (updateOrderProductDto.hasOwnProperty("qta")) {
      order.products[prodIndex].qta = updateOrderProductDto.qta
    }
    if (updateOrderProductDto.hasOwnProperty("price")) {
      order.products[prodIndex].price = updateOrderProductDto.price
    }
    if (updateOrderProductDto.hasOwnProperty("repayment")) {
      order.products[prodIndex].repayment = updateOrderProductDto.repayment
    }
  
    order.amount = OrdersService.calcOrderAmount(order);
  
    const prodDiff = diff(originalOrder.products[prodIndex], updateOrderProductDto)
  
    const newMessage = await this.communicationService.addMessage(order.communication as any, {
      message: "product updated",
      messageData: {
        productUpdate: {
          product: {
            _id: product._id,
            title: product.title
          },
          diff: prodDiff,
          originalData: originalOrder.products[prodIndex]
        }
      }
    }, MessageTypeEnum.ORDER_PRODUCT_UPDATE)
  
    try {
      await order.save();
    
      return order.populate(['products.product', 'communication'])
    } catch (er) {
      if (newMessage) {
        await this.communicationService.removeMessage(newMessage.id)
      }
    }
  }
  
  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id)
  }
  
  private static calcOrderAmount(order: Order): number {
    return order.products.reduce((acc, curr) => acc + (curr.price * curr.qta), 0)
  }
}
