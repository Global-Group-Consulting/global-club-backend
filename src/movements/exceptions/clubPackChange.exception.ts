import {HttpException, HttpStatus} from "@nestjs/common";

export class ClubPackChangeException extends HttpException {
  constructor(message?: string) {
    super(message || "Can't change the pack for the requested movement.", HttpStatus.BAD_REQUEST);
  }
}
