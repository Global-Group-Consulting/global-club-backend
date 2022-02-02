import {HttpException, HttpStatus} from "@nestjs/common";

export class RemoveException extends HttpException {
  constructor(message?: string, code?: number) {
    super(message || "Can't remove the requested element.", code || HttpStatus.BAD_REQUEST);
  }
}
