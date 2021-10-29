import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserBasic, UserBasicSchema } from './schemas/user-basic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserBasic.name,
        schema: UserBasicSchema
      }
    ], "legacy")
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
