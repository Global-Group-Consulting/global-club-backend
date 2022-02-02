import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import {CommunicationsService} from './communications.service';
import {CreateCommunicationDto} from './dto/create-communication.dto';
import {UpdateCommunicationDto} from './dto/update-communication.dto';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {ReadProductDto} from "../products/dto/read-product.dto";
import {Communication} from "./schemas/communications.schema";
import {AddMessageCommunicationDto} from "./dto/add-message-communication.dto";
import { PaginatedFilterCommunicationDto } from './dto/paginated-filter-communication.dto';
import { PaginatedResultCommunicationDto } from './dto/paginated-result-communication.dto';

@ApiBearerAuth()
@ApiBasicAuth("client-key")
@ApiTags("Communications")
@Controller('communications')
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationsService) {
  }
  
  @Post()
  create(@Body() createCommunicationDto: CreateCommunicationDto): Promise<Communication> {
    return this.communicationsService.create(createCommunicationDto);
  }
  
  @Get()
  findAll(@Query() queryData:PaginatedFilterCommunicationDto): Promise<PaginatedResultCommunicationDto> {
    return this.communicationsService.findAll(queryData);
  }
  
  @Get(':id')
  findOne(@Param() params: ReadProductDto): Promise<Communication> {
    return this.communicationsService.findOne(params.id);
  }
  
  /*@Patch(':id')*/
  update(@Param() params: ReadProductDto, @Body() updateCommunicationDto: UpdateCommunicationDto): Promise<Communication> {
    // for now i don't need to update a conversation
    
    return //this.communicationsService.update(params.id, updateCommunicationDto);
  }
  
  /*
  * Adds a message to an existing conversation
  * */
  @Put(':id')
  addMessage(@Param() params: ReadProductDto, @Body() addMessageCommunicationDto: AddMessageCommunicationDto): Promise<Communication> {
    return this.communicationsService.addMessage(params.id, addMessageCommunicationDto);
  }
  
  @Delete(':id')
  remove(@Param() params: ReadProductDto): Promise<void> {
    return this.communicationsService.remove(params.id);
  }
}
