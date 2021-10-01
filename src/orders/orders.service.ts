import {Model} from 'mongoose';
import {REQUEST} from '@nestjs/core';
import {InjectModel} from '@nestjs/mongoose';
import {Inject, Injectable} from '@nestjs/common';
import {CreateOrderDto} from './dto/create-order.dto';
import {UpdateOrderDto} from './dto/update-order.dto';
import {Order, OrderDocument} from './schemas/order.schema';
import {Product, ProductDocument} from '../products/schemas/product.schema';
import {AuthRequest} from '../_basics/AuthRequest';
import {User} from '../users/entities/user.entity';
import {FindException} from '../_exceptions/find.exception';
import {CommunicationsService} from '../communications/communications.service';
import {CommunicationTypeEnum} from '../communications/enums/communication.type.enum';
import {UpdateOrderStatusDto} from "./dto/update-order-status.dto";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private communicationService: CommunicationsService,
    @Inject(REQUEST) private request: AuthRequest,
  ) {
  }
  
  get authUser(): User {
    return this.request.auth.user;
  }
  
  async create(createOrderDto: CreateOrderDto) {
    const newData: any = {
      ...createOrderDto,
      user: this.authUser,
    };
    
    // Get the list of only ids
    const productIds = createOrderDto.products.reduce((acc, curr) => {
      acc.push(curr.id);
      
      return acc;
    }, []);
    
    // Count the found results
    const productsExists = await this.productModel
      .where({_id: {$in: productIds}})
      .exec();
    
    // If there is a difference between the found products and the order ones,
    // indicates there is some error, so can't proceed
    if (productsExists.length !== productIds.length) {
      throw new FindException("One or more products can't be found");
    }
    
    // Temporary generates the order, but don't save it yet
    const newOrder = new this.orderModel(newData);
    
    // Generates the communication associated with this order.
    const relatedCommunication = await this.communicationService.create({
      type: CommunicationTypeEnum.ORDER,
      title: `Ordine #${newOrder.id} del ${new Date().toLocaleString('it')}`,
      message: `Riepilogo dell'ordine: <br>
        N° prodotti: ${productsExists.length}<br>
        <ul>
        <li>${productsExists
        .reduce((acc, curr) => {
          const incomingProduct = createOrderDto.products.find(
            (prod) => prod.id === curr.id,
          );
          acc.push(`<strong>${curr.title}</strong> x ${incomingProduct.qta}`);
          
          return acc;
        }, [])
        .join('</li><li>')}</li>
        </ul>`,
    });
    
    // Assign the communication id as a ref to the order
    newOrder.communication = relatedCommunication.id;
    
    try {
      return await newOrder.save();
    } catch (e) {
      // If there is an error i remove the created communication
      await this.communicationService.remove(relatedCommunication.id);
      
      throw e
    }
  }
  
  findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }
  
  async findOne(id: string): Promise<Order> {
    const result = await this.orderModel
      .findById(
        id,
        {},
        {
          populate: ['products.product', 'communication'],
        },
      )
      .exec();
    
    return result;
  }
  
  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
  
  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    // TODO:: completare la funzione che cambia lo stato dell'ordine
    // nel caso in cui viene approvato, aggiungere i movimenti necessari usando il metodo
    // use nel movementsService
    
    return {} as Order
  }
  
  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }
}
