import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {


    @Post("register")
    async register(@Body() registerUserDto:RegisterUserDto ){
    }


}
