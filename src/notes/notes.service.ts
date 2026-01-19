import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from './schema/note.schema';
import { CreateNotesDto } from './dto/create-notes.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Client, ClientDocument } from 'src/client/schema/client.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
    @InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) { }

  /**
   * Create one or multiple notes for a client (with transaction support)
   */
  async createNotes(
    userId: string,
    clientId: string,
    createNotesDto: CreateNotesDto,
  ): Promise<NoteDocument[]> {
    // Validate clientId format
    if (!Types.ObjectId.isValid(clientId)) {
      throw new BadRequestException('Invalid client ID format');
    }

    // Start transaction for atomic operation
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // Validate client ownership (ensure client belongs to this user)
      const clientExists = await this.clientModel
        .findOne({
          _id: clientId,
          user: userId,
        });

      if (!clientExists) {
        throw new ForbiddenException(
          'Client not found or does not belong to you',
        );
      }

      // Create notes array
      const notesToCreate = createNotesDto.notes.map((noteItem) => ({
        user: new Types.ObjectId(userId),
        client: new Types.ObjectId(clientId),
        content: noteItem.content,
      }));

      // Insert all notes
      const createdNotes = await this.noteModel.insertMany(notesToCreate, {
        session,
      });

      // Commit transaction
      await session.commitTransaction();

      return createdNotes;
    } catch (error) {
      // Rollback on error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get all notes for a specific client
   */
  async getNotesByClient(
    userId: string,
    clientId: string,
  ): Promise<NoteDocument[]> {
    // Validate clientId format
    if (!Types.ObjectId.isValid(clientId)) {
      throw new BadRequestException('Invalid client ID format');
    }

    // Verify client ownership
    const clientExists = await this.clientModel
      .findOne({
        _id: clientId,
        user:userId,
      });

    if (!clientExists) {
      throw new ForbiddenException(
        'Client not found or does not belong to you',
      );
    }

    // Get notes sorted by most recent first
   const notes=await this.noteModel
      .find({
        client: new Types.ObjectId(clientId),
        user: new Types.ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .exec();

      return notes
  }

  /**
   * Update a note
   */
  async updateNote(
    userId: string,
    noteId: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<NoteDocument> {
    // Validate noteId format
    if (!Types.ObjectId.isValid(noteId)) {
      throw new BadRequestException('Invalid note ID format');
    }

    const note = await this.noteModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(noteId),
        user: new Types.ObjectId(userId), // Ensure user owns this note
      },
      { $set: updateNoteDto },
      { new: true, runValidators: true },
    );

    if (!note) {
      throw new NotFoundException('Note not found or does not belong to you');
    }

    return note;
  }

  /**
   * Delete a note
   */
  async deleteNote(userId: string, noteId: string): Promise<void> {
    // Validate noteId format
    if (!Types.ObjectId.isValid(noteId)) {
      throw new BadRequestException('Invalid note ID format');
    }

    const result = await this.noteModel.deleteOne({
      _id: new Types.ObjectId(noteId),
      user: new Types.ObjectId(userId), // Ensure user owns this note
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Note not found or does not belong to you');
    }
  }



  //delete all notes of a client
  async deleteNotesByClient(userId: string, clientId: string): Promise<void> {
    // Validate clientId format
    if (!Types.ObjectId.isValid(clientId)) {
      throw new BadRequestException('Invalid client ID format');
    }

    const result = await this.noteModel.deleteMany({
      client: new Types.ObjectId(clientId),
      user: new Types.ObjectId(userId), // Ensure user owns this note
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Notes not found or does not belong to you');
    }
  }
}
