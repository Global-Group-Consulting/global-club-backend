import {Request} from "express"
import {User} from "../users/entities/user.entity";

export interface AuthUser {
  user: User,
  permissions: string[],
  roles: string[]
}

export interface AuthRequest extends Request {
  auth: AuthUser
}
