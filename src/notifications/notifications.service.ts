import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { SettingsService } from "src/settings/settings.service";

// notifications.service.ts
@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private notificationQueue: Queue,
    private settingsService: SettingsService,
  ) {}
  async scheduleFollowUpReminder(followUp, userId: string) {
    const settings = await this.settingsService.getSettings(userId);
    
    // Calculate when to send notification
    const scheduledTime = new Date(followUp.scheduledAt);
    const notifyAt = new Date(
      scheduledTime.getTime() - settings.reminderOffset * 60 * 1000
    );
    
    const delay = notifyAt.getTime() - Date.now();
    
    // Don't schedule if already past
    if (delay <= 0) {
      console.log('Follow-up time already passed');
      return;
    }
    
    // Add job to queue
    await this.notificationQueue.add(
      'followup-reminder',
      {
        followUpId: followUp._id.toString(),
        userId,
        clientId: followUp.client.toString(),
      },
      {
        delay,
        jobId: `followup-${followUp._id}`,  // Unique ID for cancellation
        removeOnComplete: true,
        removeOnFail: false,
      }
    );
    
    console.log(`Scheduled reminder for ${notifyAt.toISOString()}`);
  }
  async cancelFollowUpReminder(followUpId: string) {
    const job = await this.notificationQueue.getJob(`followup-${followUpId}`);
    if (job) {
      await job.remove();
    }
  }
}