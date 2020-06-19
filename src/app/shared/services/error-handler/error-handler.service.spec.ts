import { RouterModule } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { APP_CONFIG, AppConfig } from '@config/app.config';
import { ErrorHandlerService } from './error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@auth/auth.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { NotifyFactory } from '@shared/factories/notify.factory';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ],
      providers: [{ provide: APP_CONFIG, useValue: AppConfig }]
    });

    service = TestBed.get(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#handleError', () => {
    it('should unauthorize user if occured 401 status', () => {
      const error = new HttpErrorResponse({ status: 401 });
      const authService = TestBed.get(AuthService);
      spyOn(authService, 'isUserSignedIn').and.returnValue(true);
      const spy = spyOn(authService, 'unauthorize').and.returnValue(of({}));

      service.handleError(error);
      expect(spy).toHaveBeenCalled();
    });

    it('should notify user if occured 403 status', () => {
      const error = new HttpErrorResponse({ status: 403 });
      const notifyService = TestBed.get(NotificationService);
      const notification = NotifyFactory.create({ event_type: 'error' });
      spyOn(NotifyFactory, 'create').and.returnValue(notification);
      const spy = spyOn(notifyService, 'alert');

      service.handleError(error);
      expect(notification.message).toMatch('Доступ запрещен');
      expect(spy).toHaveBeenCalledWith(notification);
    });

    it('should notify user if occured 500 status', () => {
      const error = new HttpErrorResponse({ status: 500 });
      const notifyService = TestBed.get(NotificationService);
      const notification = NotifyFactory.create({ event_type: 'error' });
      spyOn(NotifyFactory, 'create').and.returnValue(notification);
      const spy = spyOn(notifyService, 'alert');

      service.handleError(error);
      expect(notification.message).toMatch('На сервере произошла ошибка. Мы автоматически получили уведомление о проблеме.');
      expect(spy).toHaveBeenCalledWith(notification);
    });
  });
});
