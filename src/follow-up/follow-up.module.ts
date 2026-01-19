import { Module } from '@nestjs/common';
import { FollowUpService } from './follow-up.service';
import { FollowUpController } from './follow-up.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowUp, FollowUpSchema } from './schema/followUp.schema';
import { QueuesModule } from 'src/queues/queues.module';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [
    QueuesModule,
    SettingsModule,
    MongooseModule.forFeature([{ name: FollowUp.name, schema: FollowUpSchema }])
  ],
  providers: [FollowUpService],
  controllers: [FollowUpController],
  exports: [FollowUpService, MongooseModule]  // ← Added MongooseModule
})
export class FollowUpModule { }
