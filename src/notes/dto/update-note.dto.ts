import {
    IsString,
    IsOptional,
    MaxLength,
} from 'class-validator';

export class UpdateNoteDto {
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    content?: string;
}
