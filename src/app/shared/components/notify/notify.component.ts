import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionCableService, Channel } from 'angular2-actioncable';

import { NotificationService } from '@shared/services/notification/notification.service';
import { EventLogI } from '@interfaces/event-log.interface';
import { notifyAnimation } from '@animations/notify.animation';
import { AuthService } from '@auth/auth.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.sass'],
  animations: [notifyAnimation]
})
export class NotifyComponent implements OnInit, OnDestroy {
  notifications: EventLogI[] = [];
  private channelServer;
  private channel: Channel;
  private readonly channelName = 'UserNotifyChannel';

  constructor(
    private notifyService: NotificationService,
    private cableService: ActionCableService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.notifications = this.notifyService.notifications;
    this.connectToCaseNotifications();
  }

  trackByNotification(index, notification: EventLogI) {
    return notification.id;
  }

  close(notification: EventLogI) {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
  }

  private connectToCaseNotifications() {
    const access_token = this.authService.getToken().access_token;
    this.channelServer = this.cableService.cable(environment.actionCableUrl, { access_token: access_token });
    this.channel = this.channelServer.channel(this.channelName);

    this.channel.received().subscribe(msg => {
      this.notifyService.notify(msg);
    });
  }

  ngOnDestroy() {
    this.channelServer.disconnect();
  }
}
