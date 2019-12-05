import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'environments/environment';
import { CheckVersionService } from './check-version.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { StubNotificationService } from '@shared/services/notification/notification.service.stub';
import { UserService } from '@shared/services/user/user.service';
import { StubUserService } from '@shared/services/user/user.service.stub';

describe('CheckVersionService', () => {
  let httpTestingController: HttpTestingController;
  let service: CheckVersionService;
  let notifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: NotificationService, useClass: StubNotificationService },
        { provide: UserService, useClass: StubUserService }
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(CheckVersionService);
    notifyService = TestBed.get(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#initCheckVersion', () => {
    const url = environment.versionCheckURL;
    const timer = 1000;
    const result = { version: '1.0.0', hash: 'test_hash' };

    beforeEach(() => {
      jasmine.clock().uninstall();
      jasmine.clock().install();
    });

    afterEach(() => {
      httpTestingController.verify();
      jasmine.clock().uninstall();
    });

    it('should call setTimeout with specified frequency', () => {
      spyOn(window, 'setInterval');
      service.initCheckVersion(url, timer);
      jasmine.clock().tick(timer);

      expect(window.setInterval).toHaveBeenCalledWith(jasmine.anything(), timer);
    });

    it('should call http request', () => {
      service.initCheckVersion(url, timer);
      jasmine.clock().tick(timer);

      httpTestingController.expectOne({
        method: 'GET',
        url: environment.versionCheckURL
      }).flush(result);
    });

    describe('when hash was changed', () => {
      beforeEach(() => {
        (service as any).currentHash = 'old_hash';
      });

      it('call NotifyService', () => {
        spyOn(notifyService, 'setMessage');
        service.initCheckVersion(url, timer);
        jasmine.clock().tick(timer);

        httpTestingController.expectOne({
          method: 'GET',
          url: environment.versionCheckURL
        }).flush(result);

        expect(notifyService.setMessage).toHaveBeenCalled();
      });
    });
  });
});
