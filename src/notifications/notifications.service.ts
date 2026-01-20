import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
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



  //push notification usage for future 
  // backend/src/notifications/notifications.service.ts
// import * as admin from 'firebase-admin';
// // Initialize with the file you downloaded in Phase 1
// admin.initializeApp({
//   credential: admin.credential.cert(require('../../firebase-service-account.json')),
// });
// async sendPushNotification(userId: string, title: string, body: string) {
//     // 1. Get user and their token from DB
//     const user = await this.userModel.findById(userId);
//     if (!user || !user.fcmToken) return;
//     // 2. Send message via Firebase
//     await admin.messaging().send({
//         token: user.fcmToken, // The address we saved earlier
//         notification: {
//             title: title,
//             body: body,
//         },
//         data: {
//             // Extra data for handling clicks
//             screen: 'ClientDetail',
//             clientId: '123'
//         }
//     });
// }

}