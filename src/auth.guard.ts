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
    
    return this.validateRequest(request.body);
  }
  
  validateRequest(inputData: InputReqData): boolean {
    const clientRegExp = new RegExp("^clt-([A-Za-z0-9]{1,})-(main|club)$")
    const serverRegExp = new RegExp("^srv-([A-Za-z0-9]{1,})-(main|club)$")
    
    const existenceTests = !!inputData._client_secret && !!inputData._server_secret && !!inputData._auth_user;
    const clientValidity = !!inputData._client_secret.match(clientRegExp)
    const serverValidity = !!inputData._server_secret.match(serverRegExp)
    
    /*
    I'm checking exist and are in the required format and if a user is provided.
    I don't need too much checks because the server is not accessible from the outside,
    but only from another server.
     */
    
    if (!existenceTests || !clientValidity || !serverValidity) {
      return false
    }
    
    return true
  }
}
