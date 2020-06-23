import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { AuthService } from './auth.service';
import { UserService } from '@shared/services/user/user.service';
import { AppConfigI } from '@interfaces/app-config.interface';
import { TokenI } from '@interfaces/token.interface';
import { APP_CONFIG, AppConfig } from '@config/app.config';

describe('AuthService', () => {
  let service: AuthService;
  let config: AppConfigI;
  let httpTestingController: HttpTestingController;
  const accessToken = { access_token: 'my access token' } as TokenI;
  const mockState = 'testState';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        UserService,
        { provide: APP_CONFIG, useValue: AppConfig }
      ]
    });

    service = TestBed.get(AuthService);
    config = TestBed.get(APP_CONFIG);
    httpTestingController = TestBed.get(HttpTestingController);
    spyOn(service as any, 'generateState').and.returnValue(mockState);
    spyOn(window, 'open');
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#authorize', () => {
    it('should save generated state in localStorage', () => {
      service.authorize();

      expect(localStorage.getItem(config.authState)).toEqual(mockState);
    });

    it('should redirect to auth center', () => {
      const authCenter = `https://auth-center.iss-reshetnev.ru/oauth/authorize?client_id=${environment.clientId}&response_type=code&state=${mockState}&redirect_uri=${environment.authorizeUri}&scope=`;
      service.authorize();

      expect(window.open).toHaveBeenCalledWith(authCenter, '_self');
    });
  });

  describe('#getAccessToken', () => {
    const accessTokenUri = `${environment.serverUrl}/api/v1/auth/token`;

    it('should return Observable', () => {
      expect(service.getAccessToken()).toEqual(jasmine.any(Observable));
    });

    it('should clear localStorage with saved state', () => {
      service.authorize();
      service.getAccessToken().subscribe(() => {
        expect(localStorage.getItem(config.authState)).toBeNull();
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: accessTokenUri
      }).flush(accessToken);
    });

    it('should save occured access token in localStorage', () => {
      service.getAccessToken().subscribe(() => {
        expect(localStorage.getItem(config.currentTokenStorage)).toEqual(JSON.stringify(accessToken));
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: accessTokenUri
      }).flush(accessToken);
    });
  });

  describe('#unauthorize', () => {
    const uri = `${environment.serverUrl}/api/v1/auth/revoke`;

    beforeEach(() => {
      localStorage.setItem(config.currentTokenStorage, JSON.stringify(accessToken));
    });

    it('should remove token from localStorage', () => {
      service.unauthorize().subscribe(() => {
        expect(localStorage.getItem(config.currentTokenStorage)).toBeNull();
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: uri
      }).flush(accessToken);
    });

    it('should call "clearUser" method for userService', () => {
      const userService = TestBed.get(UserService);
      spyOn(userService, 'clearUser');
      service.unauthorize().subscribe(() => {
        expect(userService.clearUser).toHaveBeenCalled();
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: uri
      }).flush(accessToken);
    });

    it('should emit "false" value to the isLoggedInSub subject', () => {
      service.isLoggedInSub.subscribe(value => {
        expect(value).toBeFalsy();
      });

      service.unauthorize().subscribe();

      httpTestingController.expectOne({
        method: 'POST',
        url: uri
      }).flush(accessToken);
    });
  });

  describe('#getToken', () => {
    it('should return object with access_token', () => {
      localStorage.setItem(config.currentTokenStorage, JSON.stringify(accessToken));

      expect(service.getToken()).toEqual(accessToken);
    });
  });

  describe('#setReturnUrl', () => {
    it('should save return_url into localStorage', () => {
      service.setReturnUrl('my_custom_url');

      expect(localStorage.getItem(config.redirectAfterAuthorizeUrlName)).toEqual('my_custom_url');
    });
  });

  describe('#getReturnUrl', () => {
    it('should return saved return_url', () => {
      service.setReturnUrl('my_custom_url');

      expect(service.getReturnUrl()).toEqual('my_custom_url');
    });

    it('should return empty string if return_url has not been saved', () => {
      localStorage.removeItem(config.redirectAfterAuthorizeUrlName);

      expect(service.getReturnUrl()).toEqual('');
    });
  });

  describe('#isValidState', () => {
    it('should return true if occured state is equal state saved into localStorage', () => {
      localStorage.setItem(config.authState, 'my state');

      expect(service.isValidState('my state')).toBeTruthy();
    });

    it('should return false if occured state is not equal state saved into localStorage', () => {
      expect(service.isValidState('my new state')).toBeFalsy();
    });
  });
});
