import {Module} from '@nestjs/common';
import {MovementsService} from './movements.service';
import {MovementsController} from './movements.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Movement, MovementSchema} from "./schemas/movement.schema";

@Module({
  imports: [MongooseModule.forFeature([{name: Movement.name, schema: MovementSchema}], "club")],
  controllers: [MovementsController],
  providers: [MovementsService],
  exports: [MovementsService],
})
export class MovementsModule {
}
