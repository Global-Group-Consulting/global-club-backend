import {Module} from '@nestjs/common';
import {MovementsService} from './movements.service';
import {MovementsController} from './movements.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Movement, MovementSchema} from "./schemas/movement.schema";
import { User, UserSchema } from '../users/schemas/user.schema';
import {MovementsJob} from "./jobs/movements.job";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movement.name, schema: MovementSchema }], 'club'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], 'legacy')
  ],
  controllers: [MovementsController],
  providers: [MovementsService, MovementsJob],
  exports: [MovementsService],
})
export class MovementsModule {
}
