import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'notifications',
      defaultJobOptions:{
        removeOnComplete:false,
        removeOnFail:false,
        attempts:3,
        backoff:{
          type:'exponential',
          delay:1000,
        }
      }
    }),
  ],
  exports: [BullModule],
})
export class QueuesModule {}