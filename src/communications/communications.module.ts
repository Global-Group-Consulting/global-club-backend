import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {CommunicationsService} from './communications.service';
import {CommunicationsController} from './communications.controller';
import {Communication, CommunicationsSchema} from "./schemas/communications.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Communication.name,
        schema: CommunicationsSchema
      }
    ], "club")],
  controllers: [CommunicationsController],
  providers: [CommunicationsService]
})
export class CommunicationsModule {
}
