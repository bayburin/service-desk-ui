import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { APP_CONFIG } from '@config/app.config';
import { AppConfigI } from '@interfaces/app-config.interface';
import { NotificationI } from '@interfaces/notification.interface';
import { environment } from 'environments/environment';
import { Notify } from '@shared/models/notify/notify.model';
import { NotifyFactory } from '@shared/factories/notify.factory';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: Notify[] = [];
  notificationCount = { value: 0 };
  private notificationLimit = this.config.defaultUserDashboardListCount;
  private readonly MAX_ALERT_COUNT = 5;

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfigI
  ) {}

  /**
   * Добавить сообщение в массив уведомлений.
   *
   * @param notification - объект уведомления.
   */
  notify(notification: Notify) {
    this.showNotify(notification);
    this.notificationCount.value ++;
  }

  /**
   * Добавить сообщение об ошибку в массив уведомлений.
   *
   * @param notification - объект уведомления.
   */
  alert(notification: Notify) {
    this.showNotify(notification);
  }

  /**
   * Загрузить список уведомлений.
   */
  loadNotifications(): Observable<Notify[]> {
    const notificationsUrl = `${environment.serverUrl}/api/v1/users/notifications`;
    const httpParams = new HttpParams().append('limit', `${this.notificationLimit}`);

    return this.http.get(notificationsUrl, { params: httpParams })
      .pipe(map((notifications: NotificationI[]) => notifications.map(notify => NotifyFactory.create(notify))));
  }

  /**
   * Загрузить новые уведомления.
   */
  loadNewNotifications(): Observable<Notify[]> {
    const notificationsUrl = `${environment.serverUrl}/api/v1/users/new_notifications`;
    const httpParams = new HttpParams().append('limit', `${this.notificationLimit}`);

    return this.http.get(notificationsUrl, { params: httpParams })
      .pipe(
        tap(() => this.notificationCount.value = 0),
        map((notifications: NotificationI[]) => notifications.map(notify => NotifyFactory.create(notify)))
      );
  }

  /**
   * Изменить лимит выводимых сообщений в dashboard пользователя.
   */
  toggleNotificationLimit() {
    this.notificationLimit = this.notificationLimit === this.config.defaultUserDashboardListCount ?
      this.config.maxUserDashboardListCount : this.config.defaultUserDashboardListCount;
  }

  /**
   * Установить значение лимита сообщений по умолчанию.
   */
  setDefaultNotificationLimit() {
    this.notificationLimit = this.config.defaultUserDashboardListCount;
  }

  private removeExtraItems() {
    if (this.notifications.length > this.MAX_ALERT_COUNT) {
      this.notifications.pop();
    }
  }

  private showNotify(notification: Notify) {
    this.notifications.unshift(notification);
    this.removeExtraItems();
  }
}
