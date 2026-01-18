import { Injectable } from '@nestjs/common';
import { registerUserData } from './types';

@Injectable()
export class AuthService {

    async register(registerUserDto:registerUserData){
        const {userName,email,password,phone}=registerUserDto;
        
    }
}
