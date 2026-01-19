import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNotesDto } from './dto/create-notes.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import type { RequestWithUser } from '../auth/types';

@Controller('notes')
@UseGuards(JwtGuard)
export class NotesController {
    constructor(private readonly notesService: NotesService) { }

    /**
     * POST /api/v1/notes/client/:clientId
     * Create one or multiple notes for a client
     */
    @Post('client/:clientId')
    @HttpCode(HttpStatus.CREATED)
    async createNotes(
        @Req() req: RequestWithUser,
        @Param('clientId') clientId: string,
        @Body() createNotesDto: CreateNotesDto,
    ) {
        const userId = req.user?.sub;

        const notes = await this.notesService.createNotes(
            userId,
            clientId,
            createNotesDto,
        );

        return {
            message: `${notes.length} note(s) created successfully`,
            data: notes,
        };
    }

    /**
     * GET /api/v1/notes/client/:clientId
     * Get all notes for a specific client
     */
    @Get('client/:clientId')
    async getNotesByClient(
        @Req() req: RequestWithUser,
        @Param('clientId') clientId: string,
    ) {
        const userId = req.user?.sub;

        const notes = await this.notesService.getNotesByClient(userId, clientId);

        return {
            message: 'Notes fetched successfully',
            data: notes,
        };
    }

    /**
     * PATCH /api/v1/notes/:id
     * Update a note
     */
    @Patch(':id')
    async updateNote(
        @Req() req: RequestWithUser,
        @Param('id') noteId: string,
        @Body() updateNoteDto: UpdateNoteDto,
    ) {
        const userId = req.user?.sub;

        console.log(userId,noteId,updateNoteDto)
        const note = await this.notesService.updateNote(
            userId,
            noteId,
            updateNoteDto,
        );

        return {
            message: 'Note updated successfully',
            data: note,
        };
    }

    /**
     * DELETE /api/v1/notes/:id
     * Delete a note
     */
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteNote(@Req() req: RequestWithUser, @Param('id') noteId: string) {
        const userId = req.user?.sub;

        await this.notesService.deleteNote(userId, noteId);

        return {
            message: 'Note deleted successfully',
        };
    }
}
