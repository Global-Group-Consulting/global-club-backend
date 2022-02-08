import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from 'mongoose';
import {PackEnum} from '../../packs/enums/pack.enum';
import {UserAclRolesEnum} from '../enums/user.acl.roles.enum';
import {UserClubPackEntity} from "../entities/user.clubPack.entity";

export type UserDocument = User & Document

@Schema({
  collection: "users",
})
export class User {
  @Prop({
    alias: "_id"
  })
  id: string
  
  @Prop()
  account_status: string;
  
  @Prop()
  activated_at: string;
  
  @Prop()
  birthCity: string;
  
  @Prop()
  birthCountry: string;
  
  @Prop()
  birthDate: Date;
  
  @Prop()
  birthProvince: string;
  
  @Prop()
  businessAddress: string;
  
  @Prop()
  businessCity: string;
  
  @Prop()
  businessCountry: string;
  
  @Prop()
  businessName: string;
  
  @Prop()
  businessProvince: string;
  
  @Prop()
  businessRegion: string;
  
  @Prop()
  businessZip: string;
  
  @Prop()
  clubCardNumber: string
  
  @Prop()
  clubPack: PackEnum;
  
  @Prop()
  clubPackChangeOrder: Types.ObjectId;
  
  @Prop()
  clubPackHistory: UserClubPackEntity[];
  
  @Prop()
  commissionsAssigned: string[];
  
  @Prop()
  contractBic: string;
  
  @Prop()
  contractDate: Date;
  
  @Prop()
  contractIban: string;
  
  @Prop()
  contractInitialInvestment: string;
  
  @Prop()
  contractInitialInvestmentGold: string;
  
  @Prop()
  contractInitialPaymentMethod: string;
  
  @Prop()
  contractInitialPaymentMethodOther: string;
  
  @Prop()
  contractNumber: string;
  
  @Prop()
  contractNumberLegacy: string;
  
  @Prop()
  contractPercentage: number;
  
  @Prop()
  contractSignedAt: string;
  
  @Prop()
  docExpiration: string;
  
  @Prop()
  docNumber: string;
  
  @Prop()
  docType: string;
  
  @Prop()
  email: string;
  
  @Prop()
  firstName: string;
  
  @Prop()
  fiscalCode: string;
  
  @Prop()
  gender: string;
  
  @Prop()
  gold: boolean;
  
  @Prop()
  hasSubAgents: boolean;
  
  @Prop()
  lastName: string;
  
  @Prop()
  lastChangedBy: string
  
  @Prop()
  legalRepresentativeAddress: string;
  
  @Prop()
  legalRepresentativeCity: string;
  
  @Prop()
  legalRepresentativeCountry: string;
  
  @Prop()
  legalRepresentativeProvince: string;
  
  @Prop()
  legalRepresentativeRegion: string;
  
  @Prop()
  legalRepresentativeZip: string;
  
  @Prop()
  mobile: string;
  
  @Prop()
  personType: number;
  
  @Prop({ immutable: true })
  permissions: string[];
  
  @Prop()
  phone: string;
  
  @Prop()
  referenceAgent: string;
  
  @Prop()
  role: number;
  
  @Prop()
  roles: UserAclRolesEnum[];
  
  @Prop()
  superAdmin: boolean;
  
  @Prop()
  vatNumber: string;
  
  @Prop()
  verified_at: string;
  
  @Prop()
  apps: string[];
  
  _id: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
  
}

export const UserSchema = SchemaFactory.createForClass(User)

export const userProjection = Object.keys(UserSchema.obj).reduce((acc, key) => {
  acc[key] = 1;
  
  return acc
}, {})
