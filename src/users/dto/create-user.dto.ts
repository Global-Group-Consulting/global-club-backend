import { PackEnum } from '../../packs/enums/pack.enum';

export class CreateUserDto {
  birthCity: string;
  birthCountry: string;
  birthDate: string;
  birthProvince: string;
  businessAddress: string;
  businessCity: string;
  businessCountry: string;
  businessName: string;
  businessProvince: string;
  businessRegion: string;
  businessZip: string;
  clubCardNumber: string;
  clubPack: PackEnum;
  docNumber: string;
  docType: string;
  email: string;
  firstName: string;
  fiscalCode: string;
  gender: string;
  lastName: string;
  legalRepresentativeAddress: string;
  legalRepresentativeCity: string;
  legalRepresentativeCountry: string;
  legalRepresentativeProvince: string;
  legalRepresentativeRegion: string;
  legalRepresentativeZip: string;
  mobile: string;
  personType: number;
  phone: string;
  vatNumber: string;
}
