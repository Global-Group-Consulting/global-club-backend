import {Injectable} from '@nestjs/common';
import {AxiosService} from "../axios/axios.service";
import {ConfigService} from "@nestjs/config";
import {AxiosResponse} from "axios";

@Injectable()
export class FilesService {
  constructor(private httpService: AxiosService,
              private configService: ConfigService) {
  }
  
  async delete(files: string[]): Promise<AxiosResponse> {
    return this.httpService.delete(this.configService.get<string>("http.deletePath"), {
      data: {
        filesToDelete: files
      }
    })
  }
}
