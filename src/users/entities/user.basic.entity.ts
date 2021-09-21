import {UserRoleEnum} from "../enums/user.role.enum";
import {Prop} from "@nestjs/mongoose";

export class UserBasic {
  _id: string;
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
