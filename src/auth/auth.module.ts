import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { EmailModule } from 'src/notifications/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailToken, EmailTokenSchema } from 'src/notifications/email-token.schema';
import { RefreshToken, RefreshTokenSchema } from './schema/refreshToken.schema';

@Module({
  imports: [
    UserModule, // Import UserModule to use UserService
    EmailModule, // Import EmailModule to use EmailService
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
    MongooseModule.forFeature([{ name: EmailToken.name, schema: EmailTokenSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') || '7d';
        return {
          secret: configService.get<string>('JWT_SECRET') || 'fallback-secret',
          signOptions: {
            expiresIn: expiresIn as any, // JWT library accepts string like '7d'
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
