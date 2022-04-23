import { NotificationTypeEnum } from '../../users/enums/notification.type.enum'

export interface NotificationReceiver {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export enum PlatformEnum {
  EMAIL = 'email',
  PUSH = 'push',
  APP = 'app',
}

export class NotificationDto {
  title: string
  content: string
  coverImg?: string
  type: NotificationTypeEnum
  platforms: PlatformEnum[]
  receivers: NotificationReceiver[]
  action?: {
    text: string,
    link: string
  }
  extraData?: any
}
