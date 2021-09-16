// logging.axios-interceptor.ts
import { HttpService, Injectable } from "@nestjs/common";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  AxiosInterceptor,
  AxiosFulfilledInterceptor,
  AxiosRejectedInterceptor,
} from "@narando/nest-axios-interceptor";

@Injectable()
export class HttpInterceptor extends AxiosInterceptor {
  constructor(httpService: HttpService) {
    super(httpService);
  }
  
  // requestFulfilled(): AxiosFulfilledInterceptor<AxiosRequestConfig> {}
  // requestRejected(): AxiosRejectedInterceptor {}
  // responseFulfilled(): AxiosFulfilledInterceptor<AxiosResponse> {}
  // responseRejected(): AxiosRejectedInterceptor {}
}
