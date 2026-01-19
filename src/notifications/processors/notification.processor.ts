import { Processor } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { Model } from "mongoose";
import { ClientDocument } from "src/client/schema/client.schema";
import { FollowUpDocument } from "src/follow-up/schema/followUp.schema";
import { SettingsService } from "src/settings/settings.service";

@Processor('notifications')
export class NotificationProcessor {

    constructor(
        private readonly followUpModel: Model<FollowUpDocument>,
        private readonly settingsService: SettingsService,
        private readonly clientModel: Model<ClientDocument>,
        private readonly notificationQueue: Queue,
      ) {}
  
  @Process('followup-reminder')
  async handleFollowUpReminder(job: Job) {
    const { followUpId, userId, clientId } = job.data;
    
    // 1. Get follow-up details
    const followUp = await this.followUpModel.findById(followUpId);
    if (!followUp || followUp.status !== 'PENDING') return;
    
    // 2. Get user settings
    const settings = await this.settingsService.getSettings(userId);
    
    // 3. Check if notifications enabled
    if (!settings.notificationsEnabled) return;
    
    // 4. Check quiet hours
    if (this.isQuietHours(settings)) {
      // Reschedule for after quiet hours
      await this.rescheduleAfterQuietHours(job, settings);
      return;
    }
    
    // 5. Get client details
    const client = await this.clientModel.findById(clientId);
    
    // 6. Send notification
    await this.sendNotification({
      userId,
      title: `Follow-up Reminder: ${client.name}`,
      message: followUp.goal,
      data: { followUpId, clientId }
    });
  }
  
  private isQuietHours(settings): boolean {
    if (!settings.quietHoursEnabled) return false;
    
    // Get current time in user's timezone
    const userLocalTime = new Date().toLocaleString('en-US', {
      timeZone: settings.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const [hour, minute] = userLocalTime.split(':').map(Number);
    const currentMinutes = hour * 60 + minute;
    
    const [startHour, startMin] = settings.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = settings.quietHoursEnd.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Handle overnight quiet hours (e.g., 22:00 - 07:00)
    if (startMinutes > endMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
    
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
  
  private async rescheduleAfterQuietHours(job, settings) {
    // Calculate delay until quiet hours end
    const now = new Date();
    const [endHour, endMin] = settings.quietHoursEnd.split(':').map(Number);
    
    // Create date for quiet hours end in user's timezone
    // ... timezone calculation logic
    
    // Re-add job with new delay
    await this.notificationQueue.add(
      'followup-reminder',
      job.data,
      { delay: delayUntilQuietHoursEnd }
    );
  }
}