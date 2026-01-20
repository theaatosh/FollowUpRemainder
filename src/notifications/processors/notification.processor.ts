import { Processor, WorkerHost, InjectQueue } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Client, ClientDocument } from "src/client/schema/client.schema";
import { FollowUp, FollowUpDocument, FollowUpStatus } from "src/follow-up/schema/followUp.schema";
import { SettingsService } from "src/settings/settings.service";
import { NotificationsGateway } from "../notifications.gateway";

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {

    constructor(
        @InjectModel(FollowUp.name) private readonly followUpModel: Model<FollowUpDocument>,
        private readonly settingsService: SettingsService,
        @InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
        @InjectQueue('notifications') private readonly notificationQueue: Queue,
        private readonly notificationGateway: NotificationsGateway,

    ) {
        super()
    }


    async process(job: Job): Promise<any> {
        switch (job.name) {
            case 'followup-reminder':
                return this.handleFollowUpReminder(job);
            default:
                return;
        }
    }

    async handleFollowUpReminder(job: Job) {
        const { followUpId, userId, clientId } = job.data;

        // 1. Get follow-up details
        const followUp = await this.followUpModel.findById(followUpId);
        if (!followUp || followUp.status !== FollowUpStatus.PENDING) return;

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

        console.log("cleint",client)
        // 6. Send notification
        this.notificationGateway.sendNotificationToUser(userId, {
            title: `Follow-up Reminder: ${client?.fullName}`,
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

    private async rescheduleAfterQuietHours(job: Job, settings: any) {
        // Get quiet hours end time
        const [endHour, endMin] = settings.quietHoursEnd.split(':').map(Number);

        // Get current time in user's timezone
        const now = new Date();
        const userNow = new Date(now.toLocaleString('en-US', { timeZone: settings.timeZone }));

        // Create target time (quiet hours end) for today
        let targetTime = new Date(userNow);
        targetTime.setHours(endHour, endMin, 0, 0);

        // If quiet hours end is before current time (overnight case like 22:00-07:00)
        // and we're currently after midnight but before end time, target is today
        // Otherwise, target is tomorrow
        if (targetTime <= userNow) {
            targetTime.setDate(targetTime.getDate() + 1);  // Move to tomorrow
        }

        // Calculate delay in milliseconds
        const delayMs = targetTime.getTime() - userNow.getTime();

        // Re-add job with new delay
        await this.notificationQueue.add(
            'followup-reminder',
            job.data,
            {
                delay: delayMs,
                jobId: `followup-${job.data.followUpId}-retry`  // New unique ID
            }
        );

        console.log(`Rescheduled notification for ${targetTime.toISOString()} (delay: ${delayMs}ms)`);
    }
}