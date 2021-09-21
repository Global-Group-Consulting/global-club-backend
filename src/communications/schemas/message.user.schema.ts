import {UserBasic} from "../../users/entities/user.basic.entity";
import {User} from "../../users/entities/user.entity";

export class MessageUser extends UserBasic {
  constructor(user: Partial<User>) {
    super();
    
    this._id = user._id;
    this.clubPack = user.clubPack || "";
    this.gold = user.gold || false;
    this.email = user.email || "";
    this.firstName = user.firstName || "";
    this.lastName = user.lastName || "";
    this.referenceAgent = user.referenceAgent || "";
    this.role = user.role || null;
    this.roles = user.roles || [];
    this.superAdmin = user.superAdmin || false
  }
}
