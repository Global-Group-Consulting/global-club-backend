import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {User} from "./users/entities/user.entity";

interface InputReqData {
  _client_secret: string;
  _server_secret: string;
  _auth_user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
  
    console.log(request.body)

    return this.validateRequest(request.body);
  }
  
  validateRequest(inputData: InputReqData): boolean {
    const initialTests = !!inputData._client_secret && !!inputData._client_secret && !!inputData._auth_user;
    
    if(!initialTests){
      return false
    }
    
    return true
  }
}
