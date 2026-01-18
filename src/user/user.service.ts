import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { ClientSession, Model } from 'mongoose';
import { CreateUserData } from './types';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async createUser(userData: CreateUserData,session?:ClientSession): Promise<UserDocument> {
        const user = new this.userModel(userData);
        return user.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email: email.toLowerCase() }).select('+password').exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async emailExists(email: string): Promise<boolean> {
        const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
        return !!user;
    }

    async updateUser(id:string,updateData:Partial<User>):Promise<UserDocument|null>{
        return this.userModel.findByIdAndUpdate(id,updateData,{new:true});
    }
}
