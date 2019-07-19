import { Component, OnInit, OnDestroy } from '@angular/core';
import { Channel } from 'angular2-actioncable';

import { NotificationService } from '@shared/services/notification/notification.service';
import { NotificationI } from '@interfaces/notification.interface';
import { notifyAnimation } from '@animations/notify.animation';
import { StreamService } from '@shared/services/stream/stream.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.sass'],
  animations: [notifyAnimation]
})
export class NotifyComponent implements OnInit, OnDestroy {
  notifications: NotificationI[] = [];
  private channel: Channel;
  private readonly channelName = 'UserNotifyChannel';

  constructor(
    private notifyService: NotificationService,
    private streamService: StreamService
  ) { }

  ngOnInit() {
    this.notifications = this.notifyService.notifications;
    this.connectToCaseNotifications();
  }

  notificationIcon(notification: NotificationI) {
    switch (notification.event_type) {
      case 'case':
        return 'mdi-clipboard-arrow-up-outline';
      case 'broadcast':
        return 'mdi-information-outline';
    }
  }

  trackByNotification(index, notification: NotificationI) {
    return notification.id;
  }

  /**
   * Закрыть уведомление.
   */
  close(notification: NotificationI) {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
  }

  ngOnDestroy() {
    this.channel.unsubscribe();
  }

  private connectToCaseNotifications() {
    this.channel = this.streamService.channelServer.channel(this.channelName);
    this.channel.received().subscribe(msg => {
      this.notifyService.notify(msg);
    });
  }
}
