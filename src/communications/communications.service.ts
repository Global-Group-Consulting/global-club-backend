import {Model} from 'mongoose'
import {InjectModel} from '@nestjs/mongoose'
import {Inject, Injectable} from '@nestjs/common'
import {CreateCommunicationDto} from './dto/create-communication.dto'
import {Communication, CommunicationDocument} from './schemas/communications.schema'
import {User} from '../users/schemas/user.schema'
import {AuthRequest} from '../_basics/AuthRequest'
import {FindException} from '../_exceptions/find.exception'
import {AddMessageCommunicationDto} from './dto/add-message-communication.dto'
import {FilesService} from '../files/files.service'
import {UpdateException} from '../_exceptions/update.exception'
import {MessageTypeEnum} from './enums/message.type.enum'
import {castToObjectId} from '../utilities/Formatters'
import {PaginatedFilterCommunicationDto} from './dto/paginated-filter-communication.dto';
import {BasicService, PaginatedResult} from '../_basics/BasicService';
import {ConfigService} from '@nestjs/config';
import {FindAllCommunicationsFilterMap} from './dto/filters/find-all-communications.filter';
import {OrderStatusEnum} from '../orders/enums/order.status.enum';
import {ReadMessageCommunicationDto} from "./dto/read-message-communication.dto";
import {MessageRead} from "./schemas/messsage.read.schema";
import {update} from "lodash";
import {Message} from "./schemas/messsage.schema";

@Injectable()
export class CommunicationsService extends BasicService {
  model: Model<CommunicationDocument>
  
  constructor(@InjectModel(Communication.name) private communicationModel: Model<CommunicationDocument>,
              protected config: ConfigService,
              private filesService: FilesService,
              @Inject("REQUEST") protected request: AuthRequest) {
    super();
    this.model = communicationModel;
  }
  
  get authUser(): User {
    return this.request.auth.user
  }
  
  async create(createCommunicationDto: CreateCommunicationDto, messageType?: MessageTypeEnum) {
    const newCommunication = new this.communicationModel({
      ...createCommunicationDto,
      messages: [{
        sender: this.authUser,
        content: createCommunicationDto.message,
        attachments: createCommunicationDto.attachments,
        type: messageType,
        data: createCommunicationDto.messageData
      }],
      initiator: this.authUser
    })
  
    return newCommunication.save()
  }
  
  findAll (queryData: PaginatedFilterCommunicationDto): Promise<PaginatedResult<Communication[]>> {
    const query: any = this.prepareQuery(queryData.filter, FindAllCommunicationsFilterMap)
    return this.findPaginated<Communication>(query, queryData)
  }
  
  findOne (id: string) {
    return this.communicationModel.findById(id).exec()
  }
  
  /*update(id: string, updateCommunicationDto: UpdateCommunicationDto) {
    return null
  }*/
  
  async addMessage(id: string, addMessageCommunicationDto: AddMessageCommunicationDto, type?: MessageTypeEnum, noSender = false) {
    const communication = await this.communicationModel.findById(id).exec()
  
    if (!communication) {
      throw new UpdateException('Can\'t find the communication you are trying to edit')
    }
  
    const query = {
      '$push': {
        messages: {
          sender: noSender ? null : this.authUser,
          content: addMessageCommunicationDto.message,
          attachments: addMessageCommunicationDto.attachments,
          data: addMessageCommunicationDto.messageData,
          type
        }
      }
    }
  
    await communication.update(query);
  
    return this.communicationModel.findById(id).exec();
  }
  
  async setMessageAsRead(id: string, readMessageCommunicationDto: ReadMessageCommunicationDto): Promise<MessageRead> {
    const filter = {
      _id: castToObjectId(id),
      "messages._id": castToObjectId(readMessageCommunicationDto.message),
    }
    
    const communication = await this.communicationModel.findOne(filter).exec();
    const messageToUpdate = communication?.messages.find(msg => msg._id.toString() === readMessageCommunicationDto.message);
    
    if (!messageToUpdate) {
      // throw new UpdateException("No message found");
    }
    
    const alreadyRead = messageToUpdate.readings.find(messageRead => messageRead.userId.toString() === this.authUser._id.toString())
    
    if (alreadyRead) {
      // throw new UpdateException("Message already read");
    }
    const readData = {
      userId: this.authUser._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updateRes = await this.communicationModel.updateOne(filter, {
      "$push": {
        "messages.$[elem].readings": readData
      }
    }, {
      arrayFilters: [{"elem._id": castToObjectId(readMessageCommunicationDto.message)}],
    }).exec();
    
    if (updateRes && updateRes.matchedCount && (updateRes.matchedCount == updateRes.modifiedCount)) {
      return readData as any;
    }
    
    throw new UpdateException('Can\'t find the message you are trying to update or the message is already read.')
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
  
  /**
   * Function that removes a single message.
   * This should be used to remove automatic messages, because will not remove eventual attachments.
   */
  async removeMessage (id: string): Promise<void> {
    const communication: CommunicationDocument = await this.communicationModel.findOne({ 'messages._id': castToObjectId(id) })
    
    if (!communication) {
      throw new FindException()
    }
    
    const query = {
      '$pull': {
        'messages': { '_id': castToObjectId(id) }
      }
    }
    
    await communication.update(query)
  }
}
