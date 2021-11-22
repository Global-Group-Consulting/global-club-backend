import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBasicAuth, ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Order } from "./schemas/order.schema";
import { ReadDto } from "../_basics/read.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { PaginatedFilterOrderDto } from './dto/paginated-filter-order.dto';
import { PaginatedResultOrderDto } from './dto/paginated-result-order.dto';
import { OrderResponseInterceptor } from './interceptors/order-response.interceptor';
import { ReadOrderStatusesDto } from './dto/read-order-statuses.dto';

@ApiBearerAuth()
@ApiBasicAuth("client-key")
@ApiTags("Orders")
@Controller('orders')
export class OrdersController {
  constructor (private readonly ordersService: OrdersService) {
  }
  
  @Post()
  create (@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
  
  @Get()
  findAll (@Query() data: PaginatedFilterOrderDto): Promise<PaginatedResultOrderDto> {
    return this.ordersService.findAll(data);
  }
  
  @Get("statuses")
  readStatuses (): Promise<ReadOrderStatusesDto[]> {
    return this.ordersService.groupBy("status")
  }
  
  @Get(':id')
  findOne (@Param() params: ReadDto): Promise<Order> {
    return this.ordersService.findOne(params.id);
  }
  
  //@Patch(':id')
  update (@Param() params: ReadDto, @Body() updateOrderDto: UpdateOrderDto) {
    //return this.ordersService.update(params.id, updateOrderDto);
  }
  
  /**
   * Update the status of an existing order
   */
  @Patch(':id/status')
  updateStatus(@Param() params: ReadDto, @Body() updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    return this.ordersService.updateStatus(params.id, updateOrderStatusDto);
  }
  
  @Delete(':id')
  remove(@Param() params: ReadDto) {
    return this.ordersService.remove(params.id);
  }
}
