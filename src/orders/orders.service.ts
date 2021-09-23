import {Inject, Injectable} from '@nestjs/common';
import {CreateOrderDto} from './dto/create-order.dto';
import {UpdateOrderDto} from './dto/update-order.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Order, OrderDocument} from "./schemas/order.schema";
import {Model} from "mongoose";
import {REQUEST} from "@nestjs/core";
import {AuthRequest} from "../_basics/AuthRequest";
import {User} from "../users/entities/user.entity";

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
              @Inject(REQUEST) private request: AuthRequest,) {
  }
  
  get authUser(): User {
    return this.request.auth.user;
  }
  
  create(createOrderDto: CreateOrderDto) {
    const newData: any = {
      ...createOrderDto,
      user: this.authUser
    }
    
    // TODO:: Must check if the provided products really exists.
    
    return this.orderModel.create(newData)
  }
  
  findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }
  
  async findOne(id: string): Promise<Order> {
    const result = await this.orderModel.findById(id, {}, {
      populate: "products"
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
