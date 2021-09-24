import {Model} from "mongoose";
import {REQUEST} from "@nestjs/core";
import {InjectModel} from "@nestjs/mongoose";
import {Inject, Injectable} from '@nestjs/common';
import {CreateOrderDto} from './dto/create-order.dto';
import {UpdateOrderDto} from './dto/update-order.dto';
import {Order, OrderDocument} from "./schemas/order.schema";
import {Product, ProductDocument} from "../products/schemas/product.schema";
import {AuthRequest} from "../_basics/AuthRequest";
import {User} from "../users/entities/user.entity";
import {FindException} from "../_exceptions/find.exception";

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
              @InjectModel(Product.name) private productModel: Model<ProductDocument>,
              @Inject(REQUEST) private request: AuthRequest) {
  }
  
  get authUser(): User {
    return this.request.auth.user;
  }
  
  async create(createOrderDto: CreateOrderDto) {
    const newData: any = {
      ...createOrderDto,
      user: this.authUser
    }
    
    // Get the list of only ids
    const productIds = createOrderDto.products.reduce((acc, curr) => {
      acc.push(curr.id)
      
      return acc
    }, []);
    // Count the found results
    const productsExists = await this.productModel.where({_id: {"$in": productIds}}).count()
    
    if (productsExists !== productIds.length) {
      throw new FindException("One or more products can't be found")
    }
    
    return this.orderModel.create(newData)
  }
  
  findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }
  
  async findOne(id: string): Promise<Order> {
    const result = await this.orderModel.findById(id, {}, {
      populate: "products.product"
    }).exec()
    
    return result
  }
  
  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
  
  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id)
  }
}
