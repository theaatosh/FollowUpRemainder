import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Note {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
    client: Types.ObjectId;

    @Prop({ required: true, trim: true })
    content: string;
}

export type NoteDocument = HydratedDocument<Note>;
export const NoteSchema = SchemaFactory.createForClass(Note);

// Indexes for faster queries
NoteSchema.index({ client: 1, createdAt: -1 }); // Get client notes sorted by date
NoteSchema.index({ user: 1 }); // Get all notes by user
