import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),
 DatabaseModule,
   AuthModule,
   UserModule,
   ClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
