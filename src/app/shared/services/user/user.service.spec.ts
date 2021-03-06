import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'environments/environment';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceI } from '@interfaces/service.interface';
import { UserOwnsI } from '@interfaces/user-owns.interface';
import { UserService } from './user.service';
import { AppConfig, APP_CONFIG } from '@config/app.config';
import { UserFactory } from '@shared/factories/user.factory';

describe('UserService', () => {
  let httpTestingController: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: APP_CONFIG, useValue: AppConfig }]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    userService = TestBed.get(UserService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  describe('#loadUserInfo', () => {
    const loadUserInfo = `${environment.serverUrl}/api/v1/users/info`;
    const expectedUserInfo = { tn: 12345, fio: 'Test User' };
    const expectedUser = UserFactory.create(expectedUserInfo);

    it('should return Observable with User data', () => {
      userService.loadUserInfo().subscribe(userInfo => {
        expect(userInfo).toEqual(expectedUser);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadUserInfo
      }).flush(expectedUserInfo);
    });

    it('should call "setUser" method with User data', () => {
      spyOn(userService, 'setUser');

      userService.loadUserInfo().subscribe(() => {
        expect(userService.setUser).toHaveBeenCalledWith(expectedUser);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadUserInfo
      }).flush(expectedUserInfo);
    });
  });

  describe('#loadUserOwns', () => {
    const loadUserOwnsUri = `${environment.serverUrl}/api/v1/users/owns`;

    it('should return Observable with UserOwnsI data', () => {
      const service = new Service({ id: 1, category_id: 1, name: 'test service' });
      const expectedUserOwns: UserOwnsI = {
        services: [service],
        items: []
      };

      userService.loadUserOwns().subscribe(userOwnsI => {
        expect(userOwnsI).toEqual(expectedUserOwns);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadUserOwnsUri
      }).flush(expectedUserOwns);
    });

    it('should create Service objects before return UserOwnsI data', () => {
      const service = { id: 1, category_id: 1, name: 'test service' } as ServiceI;
      const expectedUserOwns = {
        services: [service],
        items: []
      };

      userService.loadUserOwns().subscribe(userOwns => {
        userOwns.services.forEach(s => {
          expect(s).toEqual(jasmine.any(Service));
        });
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadUserOwnsUri
      }).flush(expectedUserOwns);
    });
  });

  describe('#setUser', () => {
    const userI = { tn: 12345, fio: 'test user' };
    const user = UserFactory.create(userI);

    it('should save user in localStorage', () => {
      userService.setUser(user);
      expect(localStorage.getItem('currentUser')).toEqual(JSON.stringify(userI));
    });

    it('should emit user data to user subject', () => {
      userService.user.subscribe(currentUser => {
        expect(currentUser).toEqual(user);
      });

      userService.setUser(user);
    });
  });

  describe('#clearUser', () => {
    const user = UserFactory.create({ tn: 12345, fio: 'test user' });

    it('should remove user data from localStorage', () => {
      userService.setUser(user);
      userService.clearUser();
      expect(localStorage.getItem('currentUser')).toBe(null);
    });
  });
});
