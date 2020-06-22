import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'environments/environment';
import { NotificationService } from './notification.service';
import { AppConfig, APP_CONFIG } from '@config/app.config';
import { NotificationI } from '@interfaces/notification.interface';
import { NotifyFactory } from '@shared/factories/notify.factory';
import { AppConfigI } from '@interfaces/app-config.interface';
import { Notify } from '@shared/models/notify/notify.model';

describe('NotificationService', () => {
  let httpTestingController: HttpTestingController;
  let notifyService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: APP_CONFIG, useValue: AppConfig }]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    notifyService = TestBed.get(NotificationService);
  });

  it('should be created', () => {
    expect(notifyService).toBeTruthy();
  });

  describe('#setMessage', () => {
    const message = 'Тестовое сообщение';

    beforeEach(() => {
      notifyService.setMessage(message);
    });

    it('should create instance of specified message', () => {
      expect(notifyService.notifications[0].message).toEqual(message);
    });

    it('should add notification to notifications array', () => {
      expect(notifyService.notifications.length).toEqual(1);
    });

    it('should generate mockId for notification', () => {
      notifyService.setMessage(message);

      expect(notifyService.notifications[0].mockId).toEqual(2);
      expect(notifyService.notifications[1].mockId).toEqual(1);
    });
  });

  describe('#notify', () => {
    let notification = NotifyFactory.create({ event_type: 'broadcast'});
    notification.message = 'Test notification';

    it('should add notification to notifications array', () => {
      notifyService.notify(notification);

      expect(notifyService.notifications).toEqual([notification]);
    });

    it('should remove extra notifications if count of notification greather than MAX_ALERT_COUNT value', () => {
      let i = 0;
      const maxLength = (notifyService as any).MAX_ALERT_COUNT;
      while (i <= maxLength) {
        notification = NotifyFactory.create({ event_type: 'broadcast'});
        notifyService.notify(notification);
        notification.message = `Test notification ${i}`;
        i ++;
      }

      expect(notifyService.notifications.length).toEqual(maxLength);
      expect(notifyService.notifications[maxLength - 1].message).toEqual('Test notification 1');
    });

    it('should increase "value" attribute of notificationCount object', () => {
      notifyService.notify(notification);

      expect(notifyService.notificationCount.value).toEqual(1);
    });
  });

  describe('#alert', () => {
    const msg = 'Alert notification';

    it('should add alert to notifications array', () => {
      notifyService.alert(msg);

      expect(notifyService.notifications[0].message).toEqual(msg);
    });

    it('should remove extra alerts if count of notification greather than MAX_ALERT_COUNT value', () => {
      let dynamicMsg: string;
      let i = 0;
      const maxLength = (notifyService as any).MAX_ALERT_COUNT;
      while (i <= maxLength) {
        dynamicMsg = `Alert notification ${i}`;
        notifyService.alert(dynamicMsg);
        i ++;
      }

      expect(notifyService.notifications.length).toEqual(maxLength);
      expect(notifyService.notifications[maxLength - 1].message).toEqual('Alert notification 1');
    });

    it('should not increase "value" attribute of notificationCount object', () => {
      notifyService.alert(msg);

      expect(notifyService.notificationCount.value).toEqual(0);
    });
  });

  describe('#loadNotifications', () => {
    const NotifyI = { id: 1, body: { message: 'test' }, event_type: 'broadcast' } as NotificationI;
    const expectedNotification = NotifyFactory.create(NotifyI);

    it('should return Observable with array of Notify data', inject([APP_CONFIG], (config: AppConfigI) => {
      const notificationsUrl = `${environment.serverUrl}/api/v1/users/notifications?limit=${config.defaultUserDashboardListCount}`;

      notifyService.loadNotifications().subscribe(result => {
        expect(result).toEqual([expectedNotification]);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: notificationsUrl
      }).flush([NotifyI]);
    }));
  });

  describe('#loadNewNotifications', () => {
    const NotifyI = { id: 1, body: { message: 'test' }, event_type: 'broadcast' } as NotificationI;
    const expectedNotification = NotifyFactory.create(NotifyI);

    it('should return Observable with array of Notify data', inject([APP_CONFIG], (config: AppConfigI) => {
      const notificationsUrl = `${environment.serverUrl}/api/v1/users/new_notifications?limit=${config.defaultUserDashboardListCount}`;

      notifyService.loadNewNotifications().subscribe(result => {
        expect(result).toEqual([expectedNotification]);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: notificationsUrl
      }).flush([NotifyI]);
    }));

    it('should set zero in "value" attribute of notificationCount object', inject([APP_CONFIG], (config: AppConfigI) => {
      const notificationsUrl = `${environment.serverUrl}/api/v1/users/new_notifications?limit=${config.defaultUserDashboardListCount}`;
      notifyService.notificationCount.value = 5;

      notifyService.loadNewNotifications().subscribe(() => {
        expect(notifyService.notificationCount.value).toEqual(0);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: notificationsUrl
      }).flush([NotifyI]);
    }));
  });

  describe('#toggleNotificationLimit', () => {
    it(
      'should set max value in "value" attribute of notificationCount object if had been set default value',
      inject([APP_CONFIG], (config: AppConfigI) => {
        notifyService.toggleNotificationLimit();

        expect((notifyService as any).notificationLimit).toEqual(config.maxUserDashboardListCount);
      })
    );

    it(
      'should set default value in "value" attribute of notificationCount object if had been set max value',
      inject([APP_CONFIG], (config: AppConfigI) => {
        notifyService.toggleNotificationLimit();
        notifyService.toggleNotificationLimit();

        expect((notifyService as any).notificationLimit).toEqual(config.defaultUserDashboardListCount);
      })
    );
  });

  describe('#setDefaultNotificationLimit', () => {
    it('should set default value in "value" attribute of notificationCount object', inject([APP_CONFIG], (config: AppConfigI) => {
      notifyService.toggleNotificationLimit();
      notifyService.setDefaultNotificationLimit();

      expect((notifyService as any).notificationLimit).toEqual(config.defaultUserDashboardListCount);
    }));
  });
});
