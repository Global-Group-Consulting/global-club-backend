import {Model} from "mongoose";
import {REQUEST} from "@nestjs/core";
import {InjectModel} from "@nestjs/mongoose";
import {Inject, Injectable} from '@nestjs/common';
import {CreateCommunicationDto} from './dto/create-communication.dto';
import {Communication, CommunicationDocument} from "./schemas/communications.schema";
import {User} from "../users/entities/user.entity";
import {AuthRequest} from "../_basics/AuthRequest";
import {FindException} from "../_exceptions/find.exception";
import {AddMessageCommunicationDto} from "./dto/add-message-communication.dto";
import {FilesService} from "../files/files.service";
import {UpdateException} from "../_exceptions/update.exception";

@Injectable()
export class CommunicationsService {
  constructor(@InjectModel(Communication.name) private communicationModel: Model<CommunicationDocument>,
              @Inject(REQUEST) private request: AuthRequest,
              private filesService: FilesService) {
  }
  
  get authUser(): User {
    return this.request.auth.user;
  }
  
  async create(createCommunicationDto: CreateCommunicationDto) {
    const newCommunication = new this.communicationModel({
      ...createCommunicationDto,
      messages: [{
        sender: this.authUser,
        content: createCommunicationDto.message,
        attachments: createCommunicationDto.attachments
      }],
      initiator: this.authUser
    })
    
    return newCommunication.save()
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
      throw new UpdateException("Can't find the communication you are trying to edit")
    }
    
    const query = {
      "$push": {
        messages: {
          sender: this.authUser,
          content: addMessageCommunicationDto.message,
          attachments: addMessageCommunicationDto.attachments
        }
      }
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
