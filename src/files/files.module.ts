import {Module} from '@nestjs/common';
import {FilesService} from './files.service';
import {AxiosModule} from "../axios/axios.module";

@Module({
  imports: [
    AxiosModule
  ],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {
}
