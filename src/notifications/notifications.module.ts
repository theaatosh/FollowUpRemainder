import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationProcessor } from './processors/notification.processor';
import { NotificationsGateway } from './notifications.gateway';
import { QueuesModule } from 'src/queues/queues.module';
import { SettingsModule } from 'src/settings/settings.module';
import { ClientModule } from 'src/client/client.module';
import { FollowUpModule } from 'src/follow-up/follow-up.module';
import { EmailModule } from 'src/Email/email.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[
      QueuesModule,
  SettingsModule,
  forwardRef(() => ClientModule),  // Add forwardRef here
  forwardRef(() => FollowUpModule), // Add forwardRef here
  EmailModule,
  UserModule
  ],
  providers: [NotificationsService,NotificationProcessor,NotificationsGateway],
  exports:[NotificationsService,NotificationsGateway]
})
export class NotificationsModule {}
