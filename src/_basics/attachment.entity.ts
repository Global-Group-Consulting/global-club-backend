import {IsNotEmpty} from "class-validator";

export class Attachment {
  @IsNotEmpty()
  id: string;
  
  @IsNotEmpty()
  fileName: string;
  
  @IsNotEmpty()
  size: number;
  
  @IsNotEmpty()
  mimetype: string;
}
