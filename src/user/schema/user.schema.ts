import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true, select: false }) // select: false hides password by default
    password: string;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({ default: 'user', enum: ['user', 'admin'] })
    role: string;

    @Prop()
    fcmToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
