import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {OrdersService} from './orders.service';
import {CreateOrderDto} from './dto/create-order.dto';
import {UpdateOrderDto} from './dto/update-order.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Order} from "./schemas/order.schema";
import {ReadDto} from "../_basics/read.dto";
import {UpdateOrderStatusDto} from "./dto/update-order-status.dto";

@ApiBearerAuth()
@ApiTags("Orders")
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {
  }
  
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
  
  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
  
  @Get(':id')
  findOne(@Param() params: ReadDto): Promise<Order> {
    return this.ordersService.findOne(params.id);
  }
  
  //@Patch(':id')
  update(@Param() params: ReadDto, @Body() updateOrderDto: UpdateOrderDto) {
    //return this.ordersService.update(params.id, updateOrderDto);
  }
  
  @Patch(':id/status')
  updateStatus(@Param() params: ReadDto, @Body() updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    return this.ordersService.updateStatus(params.id, updateOrderStatusDto);
  }
  
  @Delete(':id')
  remove(@Param() params: ReadDto) {
    return this.ordersService.remove(params.id);
  }
}
