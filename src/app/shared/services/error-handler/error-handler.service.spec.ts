import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule, Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
        RouterTestingModule,
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
    describe('if received 401 status', () => {
      let error: HttpErrorResponse;
      let authService: AuthService;

      beforeEach(() => {
        error = new HttpErrorResponse({ status: 401 });
        authService = TestBed.get(AuthService);

        spyOn(authService, 'isUserSignedIn').and.returnValue(true);
        spyOn(authService, 'setReturnUrl');
      });

      it('should member url to return', () => inject([Router], (router: Router) => {
        spyOn(router, 'navigate');
        service.handleError(error);

        expect(authService.setReturnUrl).toHaveBeenCalled();
      }));

      it('should redirect to "/unauthorized" page', inject([Router], (router: Router) => {
        spyOn(router, 'navigate');
        service.handleError(error);

        expect(router.navigate).toHaveBeenCalledWith(['/unauthorized']);
      }));
    });

    it('should notify user if received 403 status', () => {
      const error = new HttpErrorResponse({ status: 403 });

      service.handleError(error);
      expect(notifyService.alert).toHaveBeenCalledWith('Доступ запрещен.');
    });

    describe('when received 404 status', () => {
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

    describe('when received 422 status', () => {
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

    it('should notify user if received 500 status', () => {
      const error = new HttpErrorResponse({ status: 500 });
      const msg = `Упс! На сервере произошла ошибка. Мы автоматически получили уведомление о проблеме.
         Если со временем проблема не исчезнет, свяжитесь с нами по телефону 06.`;

      service.handleError(error);
      expect(notifyService.alert).toHaveBeenCalledWith(msg);
    });
  });
});
