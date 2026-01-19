import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSettings, UserSettingsDocument } from './schema/settings.schema';
import { Model } from 'mongoose';
import { UpdateSettingsDto } from './dto/updateSettings.dto';

@Injectable()
export class SettingsService {

    constructor(@InjectModel(UserSettings.name) private readonly userSettingsModel: Model<UserSettingsDocument>) { }

    /**
 * Get user settings, create with defaults if not exists
 */
    async getSettings(userId: string): Promise<UserSettingsDocument> {
        let settings = await this.userSettingsModel.findOne({ user: userId });
        // Auto-create default settings if not exists
        if (!settings) {
            // @ts-ignore
            settings= await this.createDefaultSettings(userId);
        }
        return settings as UserSettingsDocument;
    }

    /**
    * Update user settings (partial update)
    */
    async updateSettings(
        userId: string,
        updateSettingsDto: UpdateSettingsDto,
    ): Promise<UserSettingsDocument> {
        const settings = await this.userSettingsModel.findOneAndUpdate(
            { user: userId },
            { $set: updateSettingsDto },
            { new: true, runValidators: true },
        );
        if (!settings) {
            throw new NotFoundException('Settings not found for this user');
        }
        return settings;
    }




    /**
 * Create default settings for a new user
 */
    async createDefaultSettings(userId: string): Promise<UserSettingsDocument> {
        const defaultSettings = new this.userSettingsModel({
            user: userId,
            notificationsEnabled: true,
            soundEnabled: true,
            reminderOffset: 15, // 15 minutes before
            defaultFollowUpTime: '09:00', // 9 AM
            quietHoursEnabled: false,
            quietHoursStart: '22:00', // 10 PM
            quietHoursEnd: '07:00', // 7 AM
            timeZone: 'Asia/Kathmandu', // Default, should be detected from user's first login
        });
        return await defaultSettings.save();
    }

    /**
  * Delete user settings (for cleanup when user is deleted)
  */
    async deleteSettings(userId: string): Promise<void> {
        await this.userSettingsModel.deleteOne({ user: userId });
    }
}
