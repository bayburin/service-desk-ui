import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Notify } from '@shared/models/notify/notify.model';
import { AuthService } from '@auth/auth.service';
import { NotifyFactory } from '@shared/factories/notify.factory';
import { NotificationService } from '@shared/services/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private notification: Notify;

  constructor(private authService: AuthService, private notifyService: NotificationService) { }

  handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 401:
        if (this.authService.isUserSignedIn) {
          this.authService.unauthorize();
        }
        break;
      case 403:
        this.notification = NotifyFactory.create({ event_type: 'error' });
        this.notification.message = 'Доступ запрещен.';
        this.notifyService.alert(this.notification);
        break;
      case 500:
        this.notification = NotifyFactory.create({ event_type: 'error' });
        this.notification.message = `Упс! На сервере произошла ошибка. Мы автоматически получили уведомление о проблеме.
         Если со временем проблема не исчезнет, свяжитесь с нами по телефону 06.`;
        this.notifyService.alert(this.notification);
        break;
    }
  }
}
