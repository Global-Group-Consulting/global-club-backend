import { Module } from '@nestjs/common';
import { FinderController } from './finder.controller';
import { FinderService } from './finder.service';

@Module({
  controllers: [FinderController],
  providers: [FinderService]
})
export class FinderModule {}
