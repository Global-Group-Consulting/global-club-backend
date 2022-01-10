import {HttpException, HttpStatus} from "@nestjs/common";

export class FindException extends HttpException {
  constructor (message?: string, status = HttpStatus.BAD_REQUEST) {
    super(message || "Can't find the requested element.", status);
  }
}
