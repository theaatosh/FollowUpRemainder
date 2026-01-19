import { Module } from '@nestjs/common';
import { FollowUpService } from './follow-up.service';
import { FollowUpController } from './follow-up.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowUp, FollowUpSchema } from './schema/followUp.schema';

@Module({
  imports:[
MongooseModule.forFeature([{name:FollowUp.name,schema:FollowUpSchema}])
  ],
  providers: [FollowUpService],
  controllers: [FollowUpController],
  exports:[FollowUpService]
})
export class FollowUpModule {}
