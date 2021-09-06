import {Injectable, NestMiddleware} from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('Request...');
    
    // devo iniettare nel context lo user loggato
    next();
  }
}
