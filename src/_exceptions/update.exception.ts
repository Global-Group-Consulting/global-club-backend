import {HttpException, HttpStatus} from "@nestjs/common";

export class UpdateException extends HttpException {
  constructor(message?: string) {
    super(message || "Can't update the requested element.", HttpStatus.BAD_REQUEST);
  }
}
