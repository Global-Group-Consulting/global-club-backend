export enum CommunicationTypeEnum {
  ORDER = "order",
  HELP = "help",
  
  // generic conversation between one or more users
  CHAT = "chat",
  
  // Communication sent to a list of users to which no one can reply
  COMMUNICATION = "communication",
  
  // Newsletter that is sent to a list of users, similar to the communication
  NEWSLETTER = "newsletter",
}
