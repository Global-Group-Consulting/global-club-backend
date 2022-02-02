import { AuthRequest } from './AuthRequest';
import { Inject } from '@nestjs/common';

export class BasicController {
  @Inject("REQUEST") protected request: AuthRequest
  
  
}
