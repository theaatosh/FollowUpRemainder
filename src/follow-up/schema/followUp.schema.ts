import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export enum FollowUpStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}
@Schema({ timestamps: true })
export class FollowUp {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Client', required: true, index: true })
  client: Types.ObjectId;
  @Prop({ required: true })
  scheduledAt: Date;  // When follow-up should happen
  @Prop()
  reminderAt: Date;   // When reminder notification fires (based on user settings)
  @Prop()
  goal: string;       // Purpose of follow-up
  @Prop({ type: String, enum: FollowUpStatus, default: FollowUpStatus.PENDING })
  status: FollowUpStatus;
  @Prop()
  completedAt: Date;
  @Prop()
  bullmqJobId: string;  // Store BullMQ job ID for cancellation/updates
}
export const FollowUpSchema=SchemaFactory.createForClass(FollowUp);
export type FollowUpDocument=FollowUp & Document;