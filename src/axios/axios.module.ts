import {Module} from '@nestjs/common';
import {AxiosService} from './axios.service';
import {ConfigService} from "@nestjs/config";
import {HttpModule, HttpService} from "@nestjs/axios";
import {AXIOS_INSTANCE_TOKEN} from "@nestjs/axios/dist/http.constants";

@Module({
  imports: [ConfigService, HttpModule],
  providers: [{
    provide: AXIOS_INSTANCE_TOKEN,
    useExisting: AxiosService
  }, AxiosService],
  exports: [AxiosService]
})
export class AxiosModule {
}
