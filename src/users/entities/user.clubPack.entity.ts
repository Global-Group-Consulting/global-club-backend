import {PackEnum} from "../../packs/enums/pack.enum";
import {Schema, Types} from "mongoose";

export class UserClubPackEntity {
  pack: PackEnum;
  startsAt: Date;
  endsAt: Date;
  cost: number;
  orderId: Types.ObjectId;
  
  constructor(data: UserClubPackEntity) {
    Object.assign(this, data)
  }
}
