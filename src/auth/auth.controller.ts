import { Body, Controller, Post, HttpCode, HttpStatus, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthLoginResponse, AuthRegisterResponse } from './types';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ConfigService } from '@nestjs/config';
import ms, { StringValue } from "ms"
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly configService:ConfigService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto): Promise<AuthRegisterResponse> {
        await this.authService.register(registerDto);
        return{
            message:"User registered successfully.Verification email sent to your email.",
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK) // Login should return 200, not 201
    async login(@Body() loginDto: LoginDto,@Res({passthrough:true}) res:Response): Promise<AuthLoginResponse> {
       const {user,tokens}=await  this.authService.login(loginDto);
        const refreshTokenExpiry=this.configService.get<string>("REFRESH_TOKEN_EXPIRES_IN");
        console.log("hello")
        res.cookie("refreshToken",JSON.stringify(tokens.refreshToken),{
            httpOnly:true,
            secure:this.configService.get<string>("NODE_ENV")==="production",
            sameSite:"lax",
            maxAge: ms(refreshTokenExpiry as StringValue) 
        })

        return{
            message:"User logged in successfully",
            user,
            accessToken:tokens.accessToken
        
        }
    }

    @Post('verify-email')
    async verifyEmail(@Query() query:VerifyEmailDto){
    await this.authService.verifyEmail(query.token);
    return {
        message:"Email verified successfully"
    }
}

@Post('logout')
async logout(){
    await this.authService.logout()
    return {
        message:"Logout successful"
    }
}
}

