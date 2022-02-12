import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";

@Injectable()
export class JobGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqData: any = request.body;
    const reqHeaders: { "server-key": string } = request.headers;
    
    if (!reqHeaders["server-key"] || reqHeaders["server-key"] !== process.env.SERVER_KEY) {
      return false
    }
    
    
    return true
  }
}
