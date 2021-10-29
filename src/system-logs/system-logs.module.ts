import { Global, Module } from '@nestjs/common';
import { SystemLogsService } from './system-logs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemLog, SystemLogSchema } from './schemas/system-logs.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SystemLog.name,
        schema: SystemLogSchema
      }
    ], "club")
  ],
  providers: [SystemLogsService],
  exports: [SystemLogsService]
})
export class SystemLogsModule {}
