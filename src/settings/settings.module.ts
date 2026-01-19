import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSettings, UserSettingsSchema } from './schema/settings.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:UserSettings.name,schema:UserSettingsSchema}])
  ],
  controllers: [SettingsController],
  providers: [SettingsService]
})
export class SettingsModule {}
