import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import {CommunicationsService} from './communications.service';
import {CreateCommunicationDto} from './dto/create-communication.dto';
import {UpdateCommunicationDto} from './dto/update-communication.dto';
import {ApiTags} from "@nestjs/swagger";
import {ReadProductDto} from "../products/dto/read-product.dto";
import {Communication} from "./schemas/communications.schema";
import {AddMessageCommunicationDto} from "./dto/add-message-communication.dto";

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
  findAll(): Promise<Communication[]> {
    return this.communicationsService.findAll();
  }
  
  @Get(':id')
  findOne(@Param() params: ReadProductDto): Promise<Communication> {
    return this.communicationsService.findOne(params.id);
  }
  
  @Patch(':id')
  update(@Param() params: ReadProductDto, @Body() updateCommunicationDto: UpdateCommunicationDto): Promise<Communication> {
    return this.communicationsService.update(params.id, updateCommunicationDto);
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
