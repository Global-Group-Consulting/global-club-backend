import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {User} from "./users/entities/user.entity";
import {ConfigService} from "@nestjs/config";

interface InputReqData {
  _auth_user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  fakeUser: Partial<User> = {
    "firstName": "Florian",
    "lastName": "Leica",
    "email": "florian.leica@gmail.com",
    "account_status": "active",
    "created_at": "2020-10-03T09:24:52.054Z",
    "updated_at": "2021-06-28T13:58:27.586Z",
    "contractNumber": 12345,
    "role": 1,
    "personType": 1,
    "birthCity": "Valbella di sotto",
    "birthCountry": "it",
    "birthProvince": "ao",
    "businessName": "Azienda La mantovana",
    "docNumber": "AI787363",
    "docType": 2,
    "fiscalCode": "MRSNSY76765AB76I",
    "gender": "m",
    "vatNumber": "0128675657234",
    "mobile": "3202945432",
    "phone": "04408364564",
    "superAdmin": true,
    "id": "5fc411ba5314e159727c9d37",
    "lastChangedBy": "5fc412a93d36340022d494bb",
    "birthDate": "1989-09-06T00:00:00.000Z",
    "roles": [
      "super_admin"
    ],
    "permissions": [
      "communications:*",
      "users:*",
      "developer:*",
      "translations:*",
      "acl:*",
      "club:*",
      "brites.all:*",
      "users.all:*",
      "calculator:*",
      "requests.all:*",
      "commissions.all:*",
      "movements.all:*",
      "settings.all:read",
      "settings.self:read",
      "settings.self:write",
      "settings.all:write",
      "agentbrites.all:*",
      "magazine:read",
      "magazine:write",
      "reports:read"
    ]
  }
  
  constructor(private configService: ConfigService) {
  }
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const reqData: InputReqData = request.body;
    const reqHeaders: any = request.headers;
    let validationResult = true
    let auth = {
      user: {},
      permissions: [],
      roles: []
    }
    
    if (this.configService.get<string>("NODE_ENV") !== "development") {
      validationResult = this.validateRequest(reqData._auth_user, reqHeaders["client-secret"], reqHeaders["server-secret"]);
      
      auth.user = reqData._auth_user;
      auth.permissions = reqData._auth_user.permissions
      auth.roles = reqData._auth_user.roles
    } else {
      auth.user = this.fakeUser;
      auth.permissions = this.fakeUser.permissions
      auth.roles = this.fakeUser.roles
    }
    
    request.auth = auth
    
    delete request.body._auth_user
    
    return validationResult
  }
  
  validateRequest(authUser: User, clientSecret: string, serverSecret): boolean {
    const clientRegExp = new RegExp("^clt-([A-Za-z0-9]{1,})-(main|club)$")
    const serverRegExp = new RegExp("^srv-([A-Za-z0-9]{1,})-(main|club)$")
    
    const existenceTests = !!clientSecret && !!serverSecret && !!authUser;
    const clientValidity = !!clientSecret.match(clientRegExp)
    const serverValidity = !!serverSecret.match(serverRegExp)
    
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
