import { Component, OnInit, OnDestroy } from '@angular/core';
import { Channel } from 'angular2-actioncable';
import { map } from 'rxjs/operators';

import { NotificationService } from '@shared/services/notification/notification.service';
import { NotificationI } from '@interfaces/notification.interface';
import { notifyAnimation } from '@animations/notify.animation';
import { StreamService } from '@shared/services/stream/stream.service';
import { Notify } from '@shared/models/notify/notify.model';
import { NotifyFactory } from '@shared/factories/notify.factory';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.sass'],
  animations: [notifyAnimation]
})
export class NotifyComponent implements OnInit, OnDestroy {
  notifications: Notify[] = [];
  private channel: Channel;
  private readonly channelName = 'UserNotifyChannel';

  constructor(
    private notifyService: NotificationService,
    private streamService: StreamService
  ) { }

  ngOnInit() {
    this.notifications = this.notifyService.notifications;
    this.connectToClaimNotifications();
  }

  trackByNotification(index, notification: Notify) {
    return notification.id || notification.mockId;
  }

  /**
   * Закрыть уведомление.
   */
  close(notification: Notify) {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
  }

  ngOnDestroy() {
    this.channel.unsubscribe();
  }

  private connectToClaimNotifications() {
    this.channel = this.streamService.channelServer.channel(this.channelName);
    this.channel.received()
      .pipe(map((notify: NotificationI) => NotifyFactory.create(notify)))
      .subscribe(notifyInstance => this.notifyService.notify(notifyInstance));
  }
}
