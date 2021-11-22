import { Model } from 'mongoose'
import { REQUEST } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { Inject, Injectable } from '@nestjs/common'
import { CreateOrderDto } from './dto/create-order.dto'
import { Order, OrderDocument } from './schemas/order.schema'
import { Product, ProductDocument } from '../products/schemas/product.schema'
import { AuthRequest } from '../_basics/AuthRequest'
import { User } from '../users/entities/user.entity'
import { FindException } from '../_exceptions/find.exception'
import { CommunicationsService } from '../communications/communications.service'
import { CommunicationTypeEnum } from '../communications/enums/communication.type.enum'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { BasicService, PaginatedResult } from '../_basics/BasicService'
import { OrderStatusEnum } from './enums/order.status.enum'
import { MessageTypeEnum } from '../communications/enums/message.type.enum'
import { UpdateException } from '../_exceptions/update.exception'
import { MovementsService } from '../movements/movements.service'
import { Movement } from '../movements/schemas/movement.schema'
import { OrderProduct } from './schemas/order-product'
import { UserAclRolesEnum } from '../users/enums/user.acl.roles.enum';
import { UserBasic } from '../users/entities/user.basic.entity';
import { PaginatedFilterDto } from '../_basics/pagination.dto';
import { PaginatedFilterOrderDto } from './dto/paginated-filter-order.dto';
import { PaginatedResultOrderDto } from './dto/paginated-result-order.dto';
import { FindAllOrdersFilter, FindAllOrdersFilterMap } from './dto/filters/find-all-orders.filter';
import { ConfigService } from '@nestjs/config';
import { ReadOrderStatusesDto } from './dto/read-order-statuses.dto';
import { ReadUserGroupsDto } from '../users/dto/read-user-groups.dto';

@Injectable()
export class OrdersService extends BasicService {
  model: Model<OrderDocument>
  
  constructor (
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private communicationService: CommunicationsService,
    private movementsService: MovementsService,
    protected config: ConfigService,
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
  
    // Map newData products to add for each one its actual price,
    // this to avoid problems if in the meanwhile the product price gets updated and the order is not yet completed.
    newData.products = newData.products.map((prod: OrderProduct) => {
      // The find method doesn't need any check because the productsExists already has been checked so the products
      // there are the same in newData.products
      prod.price = productsExists.find(p => p._id.toString() === prod.id).price
    
      // Update total amount for the order by calculating each product price * qta
      newOrder.amount += prod.price * prod.qta
    
      return prod
    })
  
    // Temporary generates the order, but don't save it yet
    const newOrder = new this.orderModel(newData)
  
    // Generates the communication associated with this order.
    const relatedCommunication = await this.communicationService.create({
      type: CommunicationTypeEnum.ORDER,
      title: `Ordine #${newOrder.id} del ${new Date().toLocaleString('it')}`,
      message: `Riepilogo dell'ordine: <br>
        N° prodotti: ${productIds.length}<br>
        <ul>
        <li>${productsExists
        .reduce((acc, curr) => {
          const incomingProduct = createOrderDto.products.find(
            (prod) => prod.id === curr.id,
          )
          acc.push(`<strong>${curr.title}</strong> x ${incomingProduct.qta}`)
  
          return acc
        }, [])
        .join('</li><li>')}</li>
        </ul>`,
    })
  
    // Assign the communication id as a ref to the order
    newOrder.communication = relatedCommunication.id
  
    try {
      return await newOrder.save()
    } catch (e) {
      // If there is an error i remove the created communication
      await this.communicationService.remove(relatedCommunication.id)
    
      throw e
    }
  }
  
  findAll (paginationDto: PaginatedFilterOrderDto): Promise<PaginatedResult<Order[]>> {
    const query: any = this.prepareQuery(paginationDto.filter, FindAllOrdersFilterMap)
  
    if (!this.userIsAdmin) {
      query.user = {
        id: this.authUser.id
      }
    }
  
    return this.findPaginated<Order>(query, paginationDto, {
      "user.permissions": 0
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
    const order = await this.findOrFail<OrderDocument>(id)
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
        message: `Stato ordine aggiornato in <strong>${order.status}</strong>`
          + (order.status === OrderStatusEnum.CANCELLED ? `<br>${updateOrderStatusDto.reason}` : '')
      }, MessageTypeEnum.ORDER_STATUS_UPDATE)
      
      // store the new message id so if necessary can remove it later.
      newMessageId = communication.messages[communication.messages.length - 1]._id.toString()
      
      // If the order status is complete, generate the withdrawal movement
      if (order.status === OrderStatusEnum.COMPLETED) {
        newMovement = await this.movementsService.use(order.user.id, {
          amountChange: order.amount,
          orderId: order._id,
          notes: 'Completamento ordine #' + order._id.toString()
        })
      }
      
      return await order.save()
    } catch (er) {
      // In case of error while applying the changes to the order,
      // remove the created message and eventually the created movement
      
      if (newMessageId) {
        await this.communicationService.removeMessage(newMessageId)
      }
      
      if (newMovement) {
        await this.movementsService.cancel(newMovement)
      }
      
      throw er
    }
  }
  
  remove (id: string) {
    return this.orderModel.findByIdAndDelete(id)
  }
}
