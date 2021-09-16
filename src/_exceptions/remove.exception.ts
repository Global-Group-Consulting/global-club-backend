import {HttpException, HttpStatus} from "@nestjs/common";

export class RemoveException extends HttpException {
  constructor(message?: string) {
    super(message || "Can't remove the requested element.", HttpStatus.BAD_REQUEST);
  }
}
