import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Channel } from 'angular2-actioncable';

import { UserService } from '@shared/services/user/user.service';
import { UserI } from '@interfaces/user.interface';
import { StreamService } from '@shared/services/stream/stream.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { userDashboardAnimation } from '@animations/user-dashboard.animation';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [userDashboardAnimation]
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  user: Observable<UserI>;
  notificationCount: { value: number };
  userDashboard = false;
  private channel: Channel;
  private readonly channelName = 'UserNotificationCountChannel';

  constructor(
    private userService: UserService,
    private notifyService: NotificationService,
    private streamService: StreamService
  ) {}

  ngOnInit() {
    this.user = this.userService.user;
    this.notificationCount = this.notifyService.notificationCount;
    this.connectToNotificationCountChannel();
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  ngOnDestroy() {
    this.channel.unsubscribe();
  }

  private connectToNotificationCountChannel() {
    this.channel = this.streamService.channelServer.channel(this.channelName);
    this.channel.connected().subscribe(() => this.channel.perform('get'));
    this.channel.received().subscribe((count: number) => this.notifyService.notificationCount.value = count);
  }
}
