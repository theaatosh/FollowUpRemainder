import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'Full name is required' })
    @IsString()
    @MinLength(2, { message: 'Full name must be at least 2 characters' })
    @MaxLength(50, { message: 'Full name must not exceed 50 characters' })
    fullName: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Please provide a valid email' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @MaxLength(50, { message: 'Password must not exceed 50 characters' })
    password: string;
}