import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { SystemLogsService } from '../system-logs/system-logs.service';
import {ConfigService} from '@nestjs/config';
import {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError} from "axios";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor (private systemLogs: SystemLogsService, private config: ConfigService) {}
  
  async catch (exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let request = ctx.getRequest();
  
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
  
    let message = exception["message"];
    let requestData: any = {}
  
    if (exception instanceof HttpException) {
      const errResponse = exception.getResponse();
    
      if (errResponse) {
        message = errResponse["message"] ?? errResponse;
      }
    
      requestData.params = request.params
      requestData.query = request.query
      requestData.body = request.body
    } else if (exception["isAxiosError"]) {
      const axiosError = exception as AxiosError;
  
      message = axiosError.message;
      requestData.params = axiosError.config.params
      // requestData.query = axiosError.config.
      requestData.body = axiosError.config.data
      requestData.rawData = axiosError.response.data
    }
  
    const name = exception["name"]
    const code = "CLUB";
    let newLoggedError;
  
    // catch and log only server errors
    if (status.toString().startsWith("5")) {
      newLoggedError = await this.systemLogs.add({
        name,
        message,
        code,
        status,
        path: request.url,
        stack: exception["stack"]
      })
    
      if (exception instanceof HttpException || exception["isAxiosError"]) {
        newLoggedError.request = requestData
    
        await newLoggedError.save()
      }
    }
  
    const respJson = {
      statusCode: status,
      message,
      name,
      timestamp: new Date().toISOString(),
      path: request.url,
      code,
      logId: newLoggedError?._id?.toString()
    }
  
    if (this.config.get("NODE_ENV") !== "production") {
      respJson["request"] = requestData
      respJson["rawError"] = exception
      respJson["rawError"].errorStack = exception["stack"] ?? ""
    }
  
    response.status(status).json(respJson);
  
    /*{
      statusCode = 400
      message = "Can't remove this file due to: Cannot read property 'id' of null"
    }*/
  }
}
