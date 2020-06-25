import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Notify } from '@shared/models/notify/notify.model';
import { AuthService } from '@auth/auth.service';
import { NotificationService } from '@shared/services/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private notification: Notify;

  constructor(private authService: AuthService, private notifyService: NotificationService) { }

  handleError(error: HttpErrorResponse) {
    let msg: string;

    switch (error.status) {
      case 401:
        if (this.authService.isUserSignedIn) {
          this.authService.clearAuthData();
        }
        break;
      case 403:
        this.notifyService.alert('Доступ запрещен.');

        break;
      case 404:
        msg = error.error instanceof Blob ? 'Файл не найден.' : 'Не найдено.';
        this.notifyService.alert(msg);

        break;
      case 422:
        msg = error.error.message || error.error.base || 'Некорректные данные.';
        this.notifyService.alert(msg);

        break;
      case 500:
        msg = `Упс! На сервере произошла ошибка. Мы автоматически получили уведомление о проблеме.
         Если со временем проблема не исчезнет, свяжитесь с нами по телефону 06.`;
        this.notifyService.alert(msg);

        break;
    }
  }
}
