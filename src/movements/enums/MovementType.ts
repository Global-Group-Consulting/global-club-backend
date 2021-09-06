export enum MovementType {
  // Generated when recapitalization occurs
  INTEREST_RECAPITALIZED = "interest_recapitalized",

  // When added by admins
  DEPOSIT_ADDED = "deposit_added",
  
  DEPOSIT_REMOVED = "deposit_removed",

  // When a user transfers them to a user
  DEPOSIT_TRANSFERED = "deposit_transferred",

  // When a user uses them
  DEPOSIT_COLLECTED = "deposit_collected"
}
