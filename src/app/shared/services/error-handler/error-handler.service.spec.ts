import { RouterModule } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { APP_CONFIG, AppConfig } from '@config/app.config';
import { ErrorHandlerService } from './error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@auth/auth.service';
import { NotificationService } from '@shared/services/notification/notification.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let notifyService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ],
      providers: [{ provide: APP_CONFIG, useValue: AppConfig }]
    });

    service = TestBed.get(ErrorHandlerService);
    notifyService = TestBed.get(NotificationService);
    spyOn(notifyService, 'alert');
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

      service.handleError(error);
      expect(notifyService.alert).toHaveBeenCalledWith('Доступ запрещен.');
    });

    describe('when occured 404 status', () => {
      describe('when error has Blob instance', () => {
        it('should notify user', () => {
          const error = new HttpErrorResponse({ error: new Blob(), status: 404 });

          service.handleError(error);
          expect(notifyService.alert).toHaveBeenCalledWith('Файл не найден.');
        });
      });

      it('should notify user', () => {
        const error = new HttpErrorResponse({ status: 404 });

        service.handleError(error);
        expect(notifyService.alert).toHaveBeenCalledWith('Не найдено.');
      });
    });

    describe('when occured 422 status', () => {
      describe('when error has message attribute', () => {
        it('should notify user', () => {
          const msg = 'test message';
          const error = new HttpErrorResponse({ error: { message: msg }, status: 422 });

          service.handleError(error);
          expect(notifyService.alert).toHaveBeenCalledWith(msg);
        });
      });

      describe('when error has base attribute and does not have message attribute', () => {
        it('should notify user', () => {
          const msg = 'test message';
          const error = new HttpErrorResponse({ error: { base: msg }, status: 422 });

          service.handleError(error);
          expect(notifyService.alert).toHaveBeenCalledWith(msg);
        });
      });

      it('should notify user', () => {
        const error = new HttpErrorResponse({ error: {}, status: 422 });

        service.handleError(error);
        expect(notifyService.alert).toHaveBeenCalledWith('Некорректные данные.');
      });
    });

    it('should notify user if occured 500 status', () => {
      const error = new HttpErrorResponse({ status: 500 });
      const msg = `Упс! На сервере произошла ошибка. Мы автоматически получили уведомление о проблеме.
         Если со временем проблема не исчезнет, свяжитесь с нами по телефону 06.`;

      service.handleError(error);
      expect(notifyService.alert).toHaveBeenCalledWith(msg);
    });
  });
});
