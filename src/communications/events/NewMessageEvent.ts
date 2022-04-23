import { UserBasic } from '../../users/entities/user.basic.entity'
import { Communication } from '../schemas/communications.schema'
import { MessageTypeEnum } from '../enums/message.type.enum'

export class NewMessageEvent {
  sender: UserBasic
  content: string
  communication: Communication
  order: string
  type?: MessageTypeEnum
  
  constructor (data: any) {
    this.sender = data.sender
    this.content = data.content
    this.communication = data.communication
    this.order = data.order
    this.type = data.type
  }
}
