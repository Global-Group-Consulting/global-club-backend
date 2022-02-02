import {Request} from "express"
import { User } from "../users/schemas/user.schema";
import { UserAclRolesEnum } from '../users/enums/user.acl.roles.enum';

export interface AuthUser {
  user: User,
  permissions: string[],
  roles: UserAclRolesEnum[]
}

export interface AuthRequest extends Request {
  auth: AuthUser
}
