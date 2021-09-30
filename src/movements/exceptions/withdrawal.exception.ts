import {HttpException, HttpStatus} from "@nestjs/common";

export class WithdrawalException extends HttpException {
  constructor(message?: string) {
    super(message || "Can't process the requested withdrawal.", HttpStatus.BAD_REQUEST);
  }
}
