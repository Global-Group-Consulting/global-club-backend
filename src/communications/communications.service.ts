import {Model} from "mongoose";
import {REQUEST} from "@nestjs/core";
import {InjectModel} from "@nestjs/mongoose";
import {Inject, Injectable} from '@nestjs/common';
import {CreateCommunicationDto} from './dto/create-communication.dto';
import {UpdateCommunicationDto} from './dto/update-communication.dto';
import {Communication, CommunicationDocument} from "./schemas/communications.schema";
import {Message} from "./schemas/messsage.schema";
import {User} from "../users/entities/user.entity";
import {AuthRequest} from "../_basics/AuthRequest";
import {FindException} from "../_exceptions/find.exception";
import {AddMessageCommunicationDto} from "./dto/add-message-communication.dto";
import {FilesService} from "../files/files.service";

@Injectable()
export class CommunicationsService {
  constructor(@InjectModel(Communication.name) private communicationModel: Model<CommunicationDocument>,
              @Inject(REQUEST) private request: AuthRequest,
              private filesService: FilesService) {
  }
  
  get authUser(): User {
    return this.request.auth.user;
  }
  
  create(createCommunicationDto: CreateCommunicationDto) {
    const message = new Message(createCommunicationDto, this.authUser);
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
    
    const message = new Message(addMessageCommunicationDto, this.authUser);
    
    const query = {
      "$push": {messages: message}
    }
    
    await communication.update(query);
    
    return this.communicationModel.findById(id).exec();
  }
  
  async remove(id: string): Promise<void> {
    const toRemove: CommunicationDocument = await this.communicationModel.findById(id)
    
    if (!toRemove) {
      throw new FindException()
    }
    
    const filesToDelete = toRemove.messages.reduce((acc, msg) => {
      if (msg.attachments && msg.attachments.length > 0) {
        // If there are attachments, adds each ones id to an array
        const msgAttachments = msg.attachments.reduce((accAttach, attach) => {
          accAttach.push(attach.id)
          
          return accAttach
        }, [])
        
        acc.push(...msgAttachments)
      }
      
      return acc
    }, [])
    
    if (filesToDelete.length > 0) {
      const deleteResult = await this.filesService.delete(filesToDelete)
    }
    
    await toRemove.delete()
    
    return
  }
}
