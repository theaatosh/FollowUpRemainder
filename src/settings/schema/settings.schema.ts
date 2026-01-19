import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
@Schema({ timestamps: true })
export class UserSettings {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;
  @Prop({ default: true })
  notificationsEnabled: boolean;
  @Prop({ default: true })
  soundEnabled: boolean;
  @Prop({ default: 15 }) // minutes before scheduled time
  reminderOffset: number;
  @Prop({ default: '09:00' })
  defaultFollowUpTime: string;
  @Prop({ default: false })
  quietHoursEnabled: boolean;
  @Prop({ default: '22:00' })
  quietHoursStart: string;
  @Prop({ default: '07:00' })
  quietHoursEnd: string;
  @Prop({ default: 'Asia/Kathmandu' })
  timeZone: string;
}

export type UserSettingsDocument = HydratedDocument<UserSettings>;
export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
// Index for faster user lookup
UserSettingsSchema.index({ user: 1 });