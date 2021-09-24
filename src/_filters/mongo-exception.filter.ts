import {ExceptionFilter, Catch, ArgumentsHost, HttpStatus} from "@nestjs/common";
import {Response} from 'express';
import {Error} from "mongoose";

@Catch(Error.ValidationError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: Error.ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    response
      .status(HttpStatus.BAD_REQUEST)
      .json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
      });
  }
}
