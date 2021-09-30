import {Movement} from "../schemas/movement.schema";
import {IsArray, IsNumber} from "class-validator";

export class CalcTotalsDto {
  
  _id: {
    "semesterId": string
  }
  
  @IsNumber()
  total: number
  
  /*@IsArray()
  movements: Movement[]*/
}
