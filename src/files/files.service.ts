import { HttpException, Injectable } from '@nestjs/common';
import { AxiosService } from "../axios/axios.service";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios";

@Injectable()
export class FilesService {
  constructor (private httpService: AxiosService,
    private configService: ConfigService) {
  }
  
  async delete (files: string[]): Promise<AxiosResponse> {
    try {
      return await this.httpService.delete(this.configService.get<string>("http.deletePath"), {
        data: {
          filesToDelete: files
        }
      })
    } catch (er: any) {
      let message = er.response?.data?.error?.message || er.response?.statusText || er.message;
      let code = er.response?.status || 400;
      
      const exception = new HttpException(message, code)
      
      exception.stack = er.response?.data?.error?.frames
      
      return Promise.reject(exception)
    }
  }
}
