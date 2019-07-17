import { Component, OnInit, HostListener, ElementRef, Output, EventEmitter, Input, OnDestroy, Inject } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';

import { AppConfigI } from '@interfaces/app-config.interface';
import { APP_CONFIG } from '@config/app.config';
import { NotificationI } from '@interfaces/notification.interface';
import { NotificationService } from '@shared/services/notification/notification.service';
import { contentBlockAnimation } from '@animations/content.animation';
import { notifyAnimation } from '@animations/notify.animation';
import { colorAnimation } from '@animations/color.animation';

@Component({
  selector: 'app-user-dashboard-menu',
  templateUrl: './user-dashboard-menu.component.html',
  styleUrls: ['./user-dashboard-menu.component.sass'],
  animations: [notifyAnimation, contentBlockAnimation, colorAnimation]
})
export class UserDashboardMenuComponent implements OnInit, OnDestroy {
  notifications: NotificationI[];
  loading = {
    allNotifications: false,
    newNotifications: false
  };
  notificationCount: { value: number };
  notificationLimit = this.config.defaultUserDashboardListCount;
  @Input() calledElement: HTMLInputElement;
  @Output() clickedOutside = new EventEmitter<boolean>();
  @Output() notificationReaded = new EventEmitter<boolean>();

  constructor(
    private elementRef: ElementRef,
    private notifyService: NotificationService,
    @Inject(APP_CONFIG) private config: AppConfigI
  ) { }

  ngOnInit() {
    this.loadNotifications();
    this.notificationCount = this.notifyService.notificationCount;
  }

  @HostListener('document:click', ['$event.target']) onClickOutside(target) {
    if (!this.elementRef.nativeElement.contains(target) && !this.calledElement.contains(target)) {
      this.clickedOutside.next(true);
    }
  }

  trackByNotification(index, notification: NotificationI) {
    return notification.id;
  }

  /**
   * Возвращает иконку уведомления взавимисомти от ее типа
   *
   * @param notification - объект уведомления.
   */
  notificationIcon(notification: NotificationI) {
    switch (notification.event_type) {
      case 'case':
        return 'mdi-clipboard-arrow-up-outline';
      case 'broadcast':
        return 'mdi-information-outline';
    }
  }

  /**
   * Загружает список новых уведомлений.
   */
  loadNewNotifications() {
    this.notifyService.loadNewNotifications()
      .subscribe(
        (data: NotificationI[]) => {
          this.notifications.splice(this.notifications.length - data.length);
          this.notifications.unshift(...data);
        }
      );
  }

  /**
   * Меняет лимит и заново загружает список уведомлений.
   */
  toggleNotificationLimit() {
    this.notifyService.toggleNotificationLimit();
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.notifyService.setDefaultNotificationLimit();
  }

  private loadNotifications() {
    this.loading.allNotifications = true;
    this.notifyService.loadNotifications()
      .pipe(
        finalize(() => this.loading.allNotifications = false),
        tap(() => this.notificationReaded.emit(true))
      )
      .subscribe((data: NotificationI[]) => this.notifications = data);
  }
}
