import { UserRoleEnum } from "../enums/user.role.enum";
import { PackEnum } from '../../packs/enums/pack.enum';
import { UserAclRolesEnum } from '../enums/user.acl.roles.enum';
import { BasicEntity } from '../../_basics/BasicEntity';
import { User } from '../schemas/user.schema';

export class UserBasic extends BasicEntity {
  _id: string;
  id?: string;
  clubPack: PackEnum;
  gold: boolean;
  email: string;
  firstName: string;
  lastName: string;
  referenceAgent: string;
  
  role: UserRoleEnum;
  roles: UserAclRolesEnum[];
  
  superAdmin: boolean
}

export const userBasicProjection: Record<keyof UserBasic, number> = {
  _id: 1,
  id: 1,
  clubPack: 1,
  gold: 1,
  email: 1,
  firstName: 1,
  lastName: 1,
  referenceAgent: 1,
  role: 1,
  roles: 1,
  superAdmin: 1,
}
