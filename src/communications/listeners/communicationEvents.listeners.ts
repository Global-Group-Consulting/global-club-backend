import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { QueueService } from '../../queue/queue.service'
import { User, UserDocument } from '../../users/schemas/user.schema'
import { I18nService } from 'nestjs-i18n'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { NotificationTypeEnum } from '../../users/enums/notification.type.enum'
import { PlatformEnum } from '../../queue/dto/notification.dto'
import { NewMessageEvent } from '../events/NewMessageEvent'
import { UsersService } from '../../users/users.service'
import { UserAclRolesEnum } from '../../users/enums/user.acl.roles.enum'

@Injectable()
export class CommunicationEventsListeners {
  constructor (
    @Inject('LARAVEL_QUEUE') private queue: QueueService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly nestEventEmitter: EventEmitter2,
    private readonly i18n: I18nService) {
  }
  
  @OnEvent('communications.newMessage')
  async handleNewMessageEvent (payload: NewMessageEvent) {
    const receivers = []
    const initiator = payload.communication.initiator
    /*const watchers = payload.communication.messages.reduce((acc, message) => {
      if (message.sender && message.sender._id.toString() !== payload.sender._id.toString()) {
        acc.push(message.sender)
      }
      
      return acc
    }, [])*/
    
    const senderIsInitiator = initiator._id.toString() === payload.sender._id.toString()
    
    // If the sender is also the initiator, notify all admins, otherwise notify the initiator
    if (senderIsInitiator) {
      const admins = await this.userModel.where({
        roles: {
          $in: [UserAclRolesEnum.ADMIN, UserAclRolesEnum.CLUB_ADMIN]
        }
      }).exec()
      
      receivers.push(...admins)
    } else {
      receivers.push(initiator)
    }
    
    const lastMessage = payload.communication.messages[payload.communication.messages.length - 1]
    
    await this.queue.dispatchNotification({
        type: NotificationTypeEnum.NEW_MESSAGE,
        title: await this.i18n.translate('notifications.newMessage.title'),
        content: await this.i18n.translate(`notifications.newMessage.${payload.type ? 'contentWithType' : 'content'}`, {
          args: {
            order: payload.order,
            type: await this.i18n.translate('enums.MessageTypeEnum.' + payload.type)
          }
        }),
        action: {
          text: await this.i18n.translate('notifications.newMessage.action'),
          link: process.env.MAIL_SITE_URL + '/finder?order=' + payload.order + '&message=' + lastMessage._id.toString()
        },
        platforms: [PlatformEnum.APP],
        receivers: receivers.map(receiver => {
          let receiverId = (receiver._id ?? receiver.id)
          
          if (typeof (receiver._id ?? receiver.id) !== "string"){
            receiverId = receiverId.toString ? receiverId.toString() : receiverId
          }
          
          console.log(receiverId)
          return {
            _id: receiverId,
            firstName: receiver.firstName,
            lastName: receiver.lastName,
            email: receiver.email
          }
        }),
        extraData: {
          // Prop that allow me to read multiple notifications based not on their id but on this value.
          // Useful especially for the "newMessage" type, where we want to set as read all relative notifications when a message is read
          multiReadBy: lastMessage._id.toString()
        }
      }
    )
  }
}
