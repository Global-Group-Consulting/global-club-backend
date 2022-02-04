import {IsNotEmpty, IsOptional} from "class-validator";

export class LocationEntity {
  @IsOptional()
  city: string;
  
  @IsOptional()
  province: string;
  
  @IsOptional()
  region: string;
}
