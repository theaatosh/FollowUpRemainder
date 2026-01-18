/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";


export class RegisterUserDto{
    @IsNotEmpty()
    fullName:string;

    @IsEmail()
    email:string;

    @IsNotEmpty()
    @MinLength(6)
    password:string;

    @IsOptional()
    phone?:string;
    
}