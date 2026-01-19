import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    InternalServerErrorException,
    Logger,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthLoginResponse, AuthRegisterResponse, LoginResponse,  TokenPayload } from './types';
import { EmailService } from 'src/notifications/email.service';
import { hashPassword } from 'src/common/utils/hashString';
import { InjectModel } from '@nestjs/mongoose';
import { EmailToken, EmailTokenDocument } from 'src/notifications/email-token.schema';
import { Model } from 'mongoose';
import { generateRandomToken } from 'src/common/utils/generateUUID';
import { RefreshToken, RefreshTokenDocument } from './schema/refreshToken.schema';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectModel(RefreshToken.name)
        private readonly refreshTokenModel: Model<RefreshTokenDocument>,
        @InjectModel(EmailToken.name)
        private readonly emailTokenModel: Model<EmailTokenDocument>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService
    ) { }

    async register(registerUserDto: { fullName: string, email: string, password: string, phone?: string }) {

        //check if user with email already exists
        const existingUserEmail = await this.userService.findByEmail(registerUserDto.email)
        if (existingUserEmail) {
            console.log(existingUserEmail)
            throw new ConflictException("User with this email already exists");
        }
        //password hashing
        const hashedPassword = await hashPassword(registerUserDto.password);
        const userObj = { ...registerUserDto, password: hashedPassword };


        //creating session
        const session = await this.emailTokenModel.db.startSession();
        session.startTransaction();

        try {

            //create user
            const newUserData = await this.userService.createUser(userObj, session);

            //generate 6 digit otp 
            const token = generateRandomToken();

            //store token in email tokens collection
            await this.emailTokenModel.create([{
                userId: newUserData._id,
                token: token,
                expiresAt: new Date(Date.now() + 300000)
            }], { session });

            //send verification email to user
            await this.emailService.sendVerificationEmail(newUserData.email, token)

            //commit transaction
            await session.commitTransaction();
            return {
                id: newUserData._id,
                email: newUserData.email,
                isEmailVerified: newUserData.isVerified
            }
        } catch (err) {
            await session.abortTransaction();
            if (err instanceof Error) {

                throw new InternalServerErrorException(`Registration failed ${err.message}`);
            }
        } finally {
            await session.endSession();
        }



    }

    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const { email, password } = loginDto;

        // Find user by email (with password field)
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Check if user is verified
        if (!user.isVerified) {
            throw new UnauthorizedException('Your account has not been verified');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }
 //generate access and refresh token
   const tokens=await this.issueToken({userId:user._id.toString(),role:user.role});
    return {
        user:{
            id:user._id.toString(),
            email:user.email,
            role:user.role
        },
        tokens
    }


    }


    async verifyEmail(token:string){
           //validate token
        if(!token){
            throw new BadRequestException("Verification token is required");
        }
        try{

            //check token validity
            const tokenDoc=await this.emailTokenModel.findOneAndDelete({token});
            if(!tokenDoc||tokenDoc.expiresAt<new Date()){
                throw new BadRequestException("Invalid or expired verification token");
            }
         
            //update user's isEmailVerified to true 
            await this.userService.updateUser(tokenDoc.userId.toString(),{isVerified:true});

            return true;
        }catch(err){
            if(err instanceof Error){
            throw new InternalServerErrorException("Failed to verify email",err.message);
        }


    }
        
    }


    async logout(){

    }


    //to issue refresh and access token
        private async  issueToken({userId,role}:{userId:string,role:string}){
            const EXPIRES_IN = 30 * 24 * 60 * 60 * 1000;//30 days
        //generate access token
        const accessToken=await this.generateAccessToken({userId:userId,role:role});
        //generate refresh token
        const refreshToken=crypto.randomUUID();
        const jti=crypto.randomUUID();

        //hash refreshtoken
        const hashedRefreshToken=await hashPassword(refreshToken);

        await this.refreshTokenModel.create({
            userId,
            jti:jti,
            refreshTokenHash:hashedRefreshToken,
            expiresAt:new Date(Date.now()+EXPIRES_IN)
        })

        return {
            accessToken,
            refreshToken:{
                jti,
                refreshToken
            }
        }
    }

 private async generateAccessToken({userId,role}:{userId:string,role:string}){
    return this.jwtService.signAsync({sub:userId,role:role})

    }

}
