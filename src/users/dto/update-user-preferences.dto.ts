import { NotificationTypeEnum } from '../enums/notification.type.enum'

export class UpdateUserPreferencesDto {
  notifications: Record<NotificationTypeEnum, boolean>
}
