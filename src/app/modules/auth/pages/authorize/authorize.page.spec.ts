import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AuthorizePageComponent } from './authorize.page';
import { AuthService } from '@auth/auth.service';
import { UserService } from '@shared/services/user/user.service';
import { APP_CONFIG, AppConfig } from '@config/app.config';
import { StubAuthService } from '@auth/auth.service.stub';
import { StubUserService } from '@shared/services/user/user.service.stub';

describe('AuthorizeComponent', () => {
  let component: AuthorizePageComponent;
  let fixture: ComponentFixture<AuthorizePageComponent>;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AuthorizePageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useClass: StubAuthService },
        { provide: UserService, useClass: StubUserService },
        { provide: APP_CONFIG, useValue: AppConfig }
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject([Router], (router: Router) => {
    fixture = TestBed.createComponent(AuthorizePageComponent);
    component = fixture.componentInstance;
    spyOn(router, 'navigate');

    authService = TestBed.get(AuthService);
    userService = TestBed.get(UserService);
  }));

  afterEach(() => {
    fixture.destroy();
  });

// Unit ====================================================================================================================================

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should start interval', fakeAsync(() => {
    spyOn(authService, 'getAccessToken').and.callFake(() => {
      tick(300);

      return throwError({});
    });
    fixture.detectChanges();

    expect(component.progressValue).toEqual(8);
  }));

  it('should load access token', () => {
    spyOn(authService, 'getAccessToken').and.callThrough();
    fixture.detectChanges();

    expect(authService.getAccessToken).toHaveBeenCalled();
  });

  it('should load information about user', () => {
    spyOn(authService, 'getAccessToken').and.callThrough();
    spyOn(userService, 'loadUserInfo');
    fixture.detectChanges();

    expect(userService.loadUserInfo).toHaveBeenCalled();
  });

  describe('when success', () => {
    beforeEach(() => {
      spyOn(authService, 'getAccessToken').and.callThrough();
    });

    it('should emit true value to "isLoggedInSub" subject', fakeAsync(() => {
      spyOn(authService.isLoggedInSub, 'next');
      fixture.detectChanges();
      tick(1001);

      expect(authService.isLoggedInSub.next).toHaveBeenCalledWith(true);
    }));

    it('should redirect to address from returnUrl variable', fakeAsync(inject([Router], (router: Router) => {
      fixture.detectChanges();
      tick(1001);

      expect(router.navigate).toHaveBeenCalledWith([authService.getReturnUrl()]);
    })));
  });

  describe('when error occured', () => {
    beforeEach(() => {
      spyOn(authService, 'getAccessToken').and.callFake(() => throwError({}));
    });

    it('should call "unauthorize" method for AuthService', () => {
      spyOn(authService, 'unauthorize');
      fixture.detectChanges();

      expect(authService.unauthorize).toHaveBeenCalled();
    });

    it('should set true to "error" attribute', () => {
      fixture.detectChanges();

      expect(component.errors).toBeTruthy();
    });
  });

// Shallow tests ===========================================================================================================================

  describe('Shallow tests', () => {
    it('should show "Идет процесс авторизации..." message if loading', () => {
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toContain('Идет процесс авторизации...');
    });

    it('should show "Ошибка авторизации" message if error', () => {
      spyOn(authService, 'getAccessToken').and.callFake(() => throwError({}));
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toContain('Ошибка авторизации');
    });

    it('should show "Авторизация прошла успешно. Перенаправление..." message if success', () => {
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toContain('Авторизация прошла успешно. Перенаправление...');
    });

    it('should show progress bar', () => {
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.progress-bar')).toBeTruthy();
    });

    it('should redirect to root path when clicked on "Войти заново" button', inject([Router], (router: Router) => {
      spyOn(authService, 'getAccessToken').and.callFake(() => throwError({}));
      const spy = spyOn(router, 'navigateByUrl');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('#reEnter').click();

      expect(`${spy.calls.first().args[0]}`).toBe('/');
    }));
  });
});
