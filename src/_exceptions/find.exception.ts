import {HttpException, HttpStatus} from "@nestjs/common";

export class FindException extends HttpException {
  constructor(message?: string) {
    super(message || "Can't find the requested element.", HttpStatus.BAD_REQUEST);
  }
}
