import { Injectable } from '@nestjs/common';
import { FollowUp, FollowUpStatus } from './schema/followUp.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FollowUpDocument } from './schema/followUp.schema';
import { CreateFollowUpDto } from './dto/createFollowUp.dto';
import { SettingsService } from 'src/settings/settings.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class FollowUpService {

    constructor(@InjectModel(FollowUp.name) private readonly followUpModel: Model<FollowUpDocument>,
@InjectQueue('notifications') private readonly notificationQueue:Queue,
private readonly settingsService:SettingsService) { }


   // FollowUp Service
async createFollowUp(userId, clientId, dto) {
  // 1. Save to database
  const followUp = await this.followUpModel.create({
    user: userId,
    client: clientId,
    scheduledAt: dto.scheduledAt,  // ISO string stored as Date
    goal: dto.goal,
  });
  console.log("followup",followUp)
  // 2. Get user settings for reminder offset
  const settings = await this.settingsService.getSettings(userId);
  console.log("settings",settings)
  // 3. Calculate notification time (scheduledAt - reminderOffset)
  const notifyAt = new Date(dto.scheduledAt);
  notifyAt.setMinutes(notifyAt.getMinutes() - settings.reminderOffset);
  console.log("notifyAt",notifyAt)
  // 4. Schedule BullMQ job
  await this.notificationQueue.add(
    'followup-reminder',
    { 
      followUpId: followUp._id,
      userId,
      clientId 
    },
    { 
      delay: notifyAt.getTime() - Date.now()  // Milliseconds until notification
    }
  );
  return followUp;
}




//get followups by client id
    async getFollowUpByClient(userId: string, clientId: string) {
        console.log("userId",userId)
        console.log("clientId",clientId)
        const followUp = await this.followUpModel.find({
            user: userId,
            client:clientId,
        })
        console.log("followuphere",followUp)
        return followUp;
    }


    //felete followup by client id
    async deleteFollowUpByClient(userId: string, clientId: string) {
        const followUp = await this.followUpModel.deleteMany({
            user: userId,
            client:clientId,
        })
        return followUp;
    }

}


// mero xai followup 6 baje ko rakhda tei belama job active bho time anusar chaleko xaina ekchoti ramro sanga time check garnu parxa followup ko 