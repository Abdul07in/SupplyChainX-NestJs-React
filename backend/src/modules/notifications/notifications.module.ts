import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventListeners } from './event-listeners';

@Module({
  providers: [NotificationsService, EventListeners],
  exports: [NotificationsService],
})
export class NotificationsModule {}