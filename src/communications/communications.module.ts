import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {CommunicationsService} from './communications.service';
import {CommunicationsController} from './communications.controller';
import {Communication, CommunicationsSchema} from "./schemas/communications.schema";
import {FilesModule} from "../files/files.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Communication.name,
        schema: CommunicationsSchema
      }
    ], "club"),
    FilesModule
  ],
  controllers: [CommunicationsController],
  providers: [CommunicationsService],
  exports: [CommunicationsService]
})
export class CommunicationsModule {
}
