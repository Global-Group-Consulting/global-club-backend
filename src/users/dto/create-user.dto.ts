import { PackEnum } from '../../packs/enums/pack.enum';
import { IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  birthCity: string;
  
  @IsOptional()
  birthCountry: string;
  
  @IsOptional()
  birthDate: string;
  
  @IsOptional()
  birthProvince: string;
  
  @IsOptional()
  businessAddress: string;
  
  @IsOptional()
  businessCity: string;
  
  @IsOptional()
  businessCountry: string;
  
  @IsOptional()
  businessName: string;
  
  @IsOptional()
  businessProvince: string;
  
  @IsOptional()
  businessRegion: string;
  
  @IsOptional()
  businessZip: string;
  
  @IsOptional()
  clubCardNumber: string;
  
  @IsOptional()
  clubPack: PackEnum;
  
  @IsOptional()
  docNumber: string;
  
  @IsOptional()
  docType: string;
  
  @IsOptional()
  email: string;
  
  @IsOptional()
  firstName: string;
  
  @IsOptional()
  fiscalCode: string;
  
  @IsOptional()
  gender: string;
  
  @IsOptional()
  lastName: string;
  
  @IsOptional()
  legalRepresentativeAddress: string;
  
  @IsOptional()
  legalRepresentativeCity: string;
  
  @IsOptional()
  legalRepresentativeCountry: string;
  
  @IsOptional()
  legalRepresentativeProvince: string;
  
  @IsOptional()
  legalRepresentativeRegion: string;
  
  @IsOptional()
  legalRepresentativeZip: string;
  
  @IsOptional()
  mobile: string;
  
  @IsOptional()
  personType: number;
  
  @IsOptional()
  phone: string;
  
  @IsOptional()
  vatNumber: string;
  
}
