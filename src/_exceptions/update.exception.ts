import {HttpException, HttpStatus} from "@nestjs/common";

export class UpdateException extends HttpException {
  constructor(message?: string, code?: number) {
    super(message || "Can't update the requested element.", code || HttpStatus.BAD_REQUEST);
  }
}
