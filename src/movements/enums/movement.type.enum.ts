export enum MovementTypeEnum {
  // Generated when recapitalization occurs
  INTEREST_RECAPITALIZED = 'interest_recapitalized',
  
  // When added by admins
  DEPOSIT_ADDED = 'deposit_added',
  
  // When removed by admins
  DEPOSIT_REMOVED = 'deposit_removed',
  
  // When a user transfers them to a user
  DEPOSIT_TRANSFERRED = 'deposit_transferred',
  
  // When a user uses them
  DEPOSIT_USED = 'deposit_used',
  
  // When a user transfer brites from premium wallet to normal wallet of another user
  DEPOSIT_RECEIVED_WP = 'deposit_received_wp',
  
  // When a user unlock brites from premium wallet to its own normal wallet
  DEPOSIT_UNLOCKED_WP = 'deposit_unlocked_wp'
}

export const MovementTypeOutList = [
  MovementTypeEnum.DEPOSIT_REMOVED,
  MovementTypeEnum.DEPOSIT_USED,
  MovementTypeEnum.DEPOSIT_TRANSFERRED
]
export const MovementTypeInList = [
  MovementTypeEnum.DEPOSIT_ADDED,
  MovementTypeEnum.INTEREST_RECAPITALIZED,
  MovementTypeEnum.DEPOSIT_RECEIVED_WP,
  MovementTypeEnum.DEPOSIT_UNLOCKED_WP,
]
