/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type RefreshTokenDocument=RefreshToken&Document
@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  jti: string;

  @Prop({ required: true })
  refreshTokenHash: string;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop({ required: true, default: () => new Date(Date.now() + 5 * 60 * 1000) })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
