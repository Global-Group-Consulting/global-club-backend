import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { SystemLogsService } from '../system-logs/system-logs.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor (private systemLogs: SystemLogsService) {}
  
  async catch (exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message =
      exception instanceof HttpException
        ? exception.message
        : exception["message"];
    
    const name = exception["name"]
    const code = "CLUB"
    
    const newLoggedError = await this.systemLogs.add({
      name,
      message,
      code,
      status,
      path: request.url,
      stack: exception["stack"]
    })
    
    response.status(status).json({
      statusCode: status,
      message,
      name,
      timestamp: new Date().toISOString(),
      path: request.url,
      code,
      logId: newLoggedError._id?.toString()
    });
    
    /*{
      statusCode = 400
      message = "Can't remove this file due to: Cannot read property 'id' of null"
    }*/
  }
}
