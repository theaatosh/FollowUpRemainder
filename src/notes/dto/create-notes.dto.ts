import {
    IsArray,
    ValidateNested,
    ArrayMinSize,
    ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NoteItemDto } from './note-item.dto';

export class CreateNotesDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NoteItemDto)
    @ArrayMinSize(1)
    @ArrayMaxSize(50) // Limit to prevent abuse
    notes: NoteItemDto[];
}
