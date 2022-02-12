import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {User} from "./users/schemas/user.schema";
import {ConfigService} from "@nestjs/config";
import {AuthUser} from "./_basics/AuthRequest";
import {UserAclRolesEnum} from './users/enums/user.acl.roles.enum';
import {Reflector} from "@nestjs/core";

interface InputReqData {
  _auth_user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {
  }
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqData: InputReqData = request.body;
    const reqHeaders: any = request.headers;
    let validationResult = true
    let auth: AuthUser = {
      user: null,
      permissions: [],
      roles: []
    }
  
    if (request.url === "/" || request.url.match(/\/\w+\/\w+\/jobs/)) {
      return true;
    }
  
    validationResult = this.validateRequest(reqData._auth_user, reqHeaders['client-secret'], reqHeaders['server-secret'])
  
    if (!validationResult) {
      return false
    }
  
    auth.user = reqData._auth_user
    auth.permissions = reqData._auth_user.permissions
    auth.roles = reqData._auth_user.roles
  
    request.auth = auth
  
    delete request.body._auth_user
  
    return validationResult
  }
  
  validateRequest(authUser: User, clientSecret: string, serverSecret): boolean {
    const clientRegExp = new RegExp('^clt-([A-Za-z0-9]{1,})-(main|club)$')
    const serverRegExp = new RegExp('^srv-([A-Za-z0-9]{1,})-(main|club)$')
  
    const existenceTests = !!clientSecret && !!serverSecret && !!authUser
  
    /*
    I'm checking exist and are in the required format and if a user is provided.
    I don't need too much checks because the server is not accessible from the outside,
    but only from another server.
     */
  
    if (!existenceTests) {
      return false
    }
  
    const clientValidity = !!clientSecret.match(clientRegExp)
    const serverValidity = !!serverSecret.match(serverRegExp)
  
    if (!clientValidity || !serverValidity) {
      return false
    }
  
    return true
  }
}
