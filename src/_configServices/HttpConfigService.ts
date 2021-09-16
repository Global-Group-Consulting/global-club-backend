import {Inject, Injectable} from "@nestjs/common";
import {HttpModuleOptions, HttpModuleOptionsFactory} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {Request} from "express";


@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(private configService: ConfigService, @Inject("REQUEST") private request: Request) {
  
  }
  
  /*
  *
  * TODO://Occorre fare un modulo dove creare un istanza di axios e settare l'interceptor
  *
  *
  * */
  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: this.configService.get<string>('http.mainServerUrl'),
      withCredentials: true,
      transformRequest: [(data, headers) => {
        const reqHeaders: any = this.request.headers || {};
        
        // Set Authorization header only if there is a value to set
        if (reqHeaders.authorization) {
          headers['Authorization'] = reqHeaders.authorization;
        }
        
        return JSON.stringify(data)
      }]
    };
  }
}
