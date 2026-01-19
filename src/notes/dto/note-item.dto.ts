import {
    IsString,
    IsNotEmpty,
    MaxLength,
} from 'class-validator';

export class NoteItemDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    content: string;
}
