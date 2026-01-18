import { Injectable } from '@nestjs/common';
import { registerUserData } from './types';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {

    constructor(@InjectModel(User))
    async register(registerUserDto:registerUserData){
        const {userName,email,password,phone}=registerUserDto;

    }
}
