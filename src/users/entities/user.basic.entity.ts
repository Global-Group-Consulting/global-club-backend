import {UserRoleEnum} from "../enums/user.role.enum";

export class UserBasic {
  id: string;
  clubPack: string;
  gold: boolean;
  email: string;
  firstName: string;
  lastName: string;
  referenceAgent: string;
  
  role: UserRoleEnum;
  roles: string[];
  
  superAdmin: boolean
}
