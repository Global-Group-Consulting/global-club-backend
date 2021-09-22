import {Inject, Injectable} from '@nestjs/common';
import {CreateCommunicationDto} from './dto/create-communication.dto';
import {UpdateCommunicationDto} from './dto/update-communication.dto';
import {Communication, CommunicationDocument} from "./schemas/communications.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Message} from "./schemas/messsage.schema";
import {REQUEST} from "@nestjs/core";
import {AuthRequest} from "../_basics/AuthRequest";
import {User} from "../users/entities/user.entity";
import {AddMessageCommunicationDto} from "./dto/add-message-communication.dto";
import {RemoveException} from "../_exceptions/remove.exception";

@Injectable()
export class CommunicationsService {
  constructor(@InjectModel(Communication.name) private communicationModel: Model<CommunicationDocument>,
              @Inject(REQUEST) private request: AuthRequest) {
  }
  
  get authUser(): User {
    return this.request.auth.user;
  }
  
  create(createCommunicationDto: CreateCommunicationDto) {
    const message = new Message(createCommunicationDto.message, this.authUser);
    delete createCommunicationDto.message;
    
    const newData: Partial<Communication> = {...createCommunicationDto, messages: [message]}
    
    // use the sender from the first message as the sender of the communication,
    // for future simplicity
    newData.sender = message.sender;
    
    return this.communicationModel.create(newData)
  }
  
  findAll(): Promise<Communication[]> {
    return this.communicationModel.find().exec();
  }
  
  findOne(id: string) {
    return this.communicationModel.findById(id).exec();
  }
  
  /*update(id: string, updateCommunicationDto: UpdateCommunicationDto) {
    return null
  }*/
  
  async addMessage(id: string, addMessageCommunicationDto: AddMessageCommunicationDto) {
    const communication = await this.communicationModel.findById(id).exec();
    
    if (!communication) {
      throw new UpdateCommunicationDto("Can't find the communication you are trying to edit")
    }
    
    const message = new Message(addMessageCommunicationDto.message, this.authUser);
    
    const query = {
      "$push": {messages: message}
    }
    
    await communication.update(query);
    
    return this.communicationModel.findById(id).exec();
  }
  
  async remove(id: string): Promise<void> {
    const result = await this.communicationModel.findByIdAndDelete(id)
    
    if(!result){
      throw new RemoveException("No communication found with the provided id.")
    }
  }
}
