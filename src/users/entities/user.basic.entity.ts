import {UserRoleEnum} from "../enums/user.role.enum";
import { PackEnum } from '../../packs/enums/pack.enum';

export class UserBasic {
  id: string;
  clubPack: PackEnum;
  gold: boolean;
  email: string;
  firstName: string;
  lastName: string;
  referenceAgent: string;
  
  role: UserRoleEnum;
  roles: string[];
  
  superAdmin: boolean
}
