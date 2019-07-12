import { Injectable } from '@angular/core';
import { EventLogI } from '@interfaces/event-log.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = [];
  notificationCount = { value: 0 };
  private readonly MAX_LENGTH = 5;
  private readonly LIFETIME = 15000;

  constructor() {}

  /**
   * Добавить сообщение в массив уведомлений.
   *
   * @param notification - объект уведомления.
   */
  notify(notification: EventLogI) {
    this.notifications.unshift(notification);
    this.removeExtraItems();
    this.startTimer(notification);
    this.notificationCount.value ++;
  }

  private removeExtraItems() {
    if (this.notifications.length > this.MAX_LENGTH) {
      this.notifications.pop();
    }
  }

  private startTimer(notification: EventLogI) {
    setTimeout(() => {
      const index = this.notifications.indexOf(notification);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    }, this.LIFETIME);
  }
}
