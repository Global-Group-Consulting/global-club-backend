import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { UserBasic } from '../../users/entities/user.basic.entity';

@Injectable()
export class OrderResponseInterceptor implements NestInterceptor {
  intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => {
      const refUser = new UserBasic();
      
      const newData = data.data.map((acc, key) => {
        if (key !== "user") {
          acc[key] = data.data[key]
        } else {
          Object.keys(acc["user"]).forEach(userKey => {
            if (!refUser.hasOwnProperty(userKey)) {
              delete acc[key][userKey]
            }
          })
        }
        
        return acc
      })
      
      data.data = newData
      
      return data
    }));
    
  }
}
