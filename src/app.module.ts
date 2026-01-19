import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
import { SettingsModule } from './settings/settings.module';
import { FollowUpModule } from './follow-up/follow-up.module';
import { NotesModule } from './notes/notes.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),
 DatabaseModule,
   AuthModule,
   UserModule,
   ClientModule,
   SettingsModule,
   FollowUpModule,
   NotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
