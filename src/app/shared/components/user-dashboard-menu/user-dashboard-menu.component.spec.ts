import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject, tick, fakeAsync, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { UserDashboardMenuComponent } from './user-dashboard-menu.component';
import { AppConfig, APP_CONFIG } from '@config/app.config';
import { NotificationService } from '@shared/services/notification/notification.service';
import { NotifyFactory } from '@shared/factories/notify.factory';
import { AppConfigI } from '@interfaces/app-config.interface';
import { Notify } from '@shared/models/notify/notify.model';

describe('UserDashboardMenuComponent', () => {
  let component: UserDashboardMenuComponent;
  let fixture: ComponentFixture<UserDashboardMenuComponent>;
  let notifyService: NotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule],
      declarations: [UserDashboardMenuComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: APP_CONFIG, useValue: AppConfig }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDashboardMenuComponent);
    component = fixture.componentInstance;
    notifyService = fixture.debugElement.injector.get(NotificationService);
  });

// Unit ====================================================================================================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial values', inject([APP_CONFIG], (config: AppConfigI) => {
    expect(component.loading.allNotifications).toBeFalsy();
    expect(component.loading.newNotifications).toBeFalsy();
    expect(component.notificationLimit).toEqual(config.defaultUserDashboardListCount);
    expect(component.arrowUp).toBeFalsy();
  }));

  it('should load notifications', () => {
    const mockNotifications = [
      NotifyFactory.create({ id: 1, body: { message: 'Hello Notify 1' }, event_type: 'broadcast' }),
      NotifyFactory.create({ id: 2, body: { message: 'Hello Notify 2' }, event_type: 'claim' })
    ];
    spyOn(notifyService, 'loadNotifications').and.returnValue(of(mockNotifications));
    fixture.detectChanges();

    expect(component.notifications).toBe(mockNotifications);
  });

  it('should emit to notificationReaded subject', () => {
    const spy = spyOn(component.notificationReaded, 'emit');
    spyOn(notifyService, 'loadNotifications').and.returnValue(of([]));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should set notificationCount object', () => {
    fixture.detectChanges();

    expect(component.notificationCount).toBe(notifyService.notificationCount);
  });

  it('should call "setDefaultNotificationLimit" method for notifyService when component is destroyed', () => {
    const spy = spyOn(notifyService, 'setDefaultNotificationLimit');
    fixture.destroy();

    expect(spy).toHaveBeenCalled();
  });

  describe('document:click Listener', () => {
    let spyOutput: jasmine.Spy;
    let body: HTMLElement;

    beforeEach(() => {
      spyOutput = spyOn(component.clickedOutside, 'next');
    });

    it('should output to "clickedOutside" if clicked outside component selector', () => {
      spyOn(fixture.elementRef.nativeElement, 'contains').and.returnValue(false);
      const clickedElement = document.createElement('button');
      component.calledElement = clickedElement;

      body = fixture.debugElement.nativeElement.querySelector('.card-body');
      body.click();

      fixture.whenStable().then(() => {
        expect(spyOutput).toHaveBeenCalled();
      });
    });

    it('should not output to "clickedOutside" if clicked inside component selector', () => {
      body = fixture.debugElement.nativeElement.querySelector('.card-body');
      body.click();

      fixture.whenStable().then(() => {
        expect(spyOutput).not.toHaveBeenCalled();
      });
    });

    it('should not output to "clickedOutside" if clicked in called selector', () => {
      const clickedElement = document.createElement('button');
      component.calledElement = clickedElement;
      clickedElement.click();

      fixture.whenStable().then(() => {
        expect(spyOutput).not.toHaveBeenCalled();
      });
    });
  });

  describe('#loadNewNotifications', () => {
    const mockNotifications = [
      NotifyFactory.create({ id: 1, body: { message: 'Hello Notify 1' }, event_type: 'broadcast' }),
      NotifyFactory.create({ id: 2, body: { message: 'Hello Notify 2' }, event_type: 'claim' }),
      NotifyFactory.create({ id: 3, body: { message: 'Hello Notify 3' }, event_type: 'claim' }),
      NotifyFactory.create({ id: 4, body: { message: 'Hello Notify 4' }, event_type: 'claim' }),
      NotifyFactory.create({ id: 5, body: { message: 'Hello Notify 5' }, event_type: 'claim' })
    ];
    const mockNewNotifications = NotifyFactory.create({ id: 6, body: { message: 'Hello Notify 3' }, event_type: 'claim' });
    let spy: jasmine.Spy;

    beforeEach(() => {
      spyOn(notifyService, 'loadNotifications').and.returnValue(of(mockNotifications));
      spy = spyOn(notifyService, 'loadNewNotifications').and.returnValue(of([mockNewNotifications]));
      fixture.detectChanges();
      component.loadNewNotifications();
    });

    it('should load new notifications if they are exists', () => {
      expect(spy).toHaveBeenCalled();
    });

    it('should remove extra notifications', () => {
      expect(component.notifications.length).toEqual(5);
    });

    it('should add new notifications to the beginnig of the notifications array', () => {
      expect(component.notifications[0]).toBe(mockNewNotifications);
    });
  });

  describe('#toggleNotificationLimit', () => {
    it('should call "toggleNotificationLimit" method in NotifyService', () => {
      const spy = spyOn(notifyService, 'toggleNotificationLimit');
      component.toggleNotificationLimit();

      expect(spy).toHaveBeenCalled();
    });

    it('should reload notifications', () => {
      const spy = spyOn(notifyService, 'loadNotifications').and.returnValue(of([]));
      component.toggleNotificationLimit();

      expect(spy).toHaveBeenCalled();
    });
  });

// Shallow tests ===========================================================================================================================

  describe('#shallow tests', () => {
    let mockNotifications: Notify[];
    let mockNewNotification: Notify;

    beforeEach(() => {
      mockNotifications = [
        NotifyFactory.create({ id: 1, body: { message: 'Hello Notify 1' }, event_type: 'broadcast' }),
        NotifyFactory.create({ id: 2, body: { message: 'Hello Notify 2' }, event_type: 'claim' }),
        NotifyFactory.create({ id: 3, body: { message: 'Hello Notify 3' }, event_type: 'claim' }),
        NotifyFactory.create({ id: 4, body: { message: 'Hello Notify 4' }, event_type: 'caclaimse' }),
        NotifyFactory.create({ id: 5, body: { message: 'Hello Notify 5' }, event_type: 'claim' })
      ];
      mockNewNotification = NotifyFactory.create({ id: 6, body: { message: 'Hello New Notify' }, event_type: 'claim' });

      spyOn(notifyService, 'loadNotifications').and.returnValues(of(mockNotifications), of(mockNotifications.concat(mockNewNotification)));

      fixture.detectChanges();
    });

    it('should show limited count of notifications', () => {
      mockNotifications.forEach(notify => {
        expect(fixture.debugElement.nativeElement.innerText).toContain(notify.message);
      });
    });

    describe('when clicked on "Смотреть остальные уведомления"', () => {
      it('should call #toggleNotificationLimit method', () => {
        const spy = spyOn(component, 'toggleNotificationLimit');
        fixture.debugElement.nativeElement.querySelector('#toggleNotificationLimit').click();
        expect(spy).toHaveBeenCalled();
      });

      it('should show all notifications if clicked on "Смотреть остальные уведомления"', () => {
        fixture.debugElement.nativeElement.querySelector('#toggleNotificationLimit').click();
        fixture.detectChanges();

        mockNotifications.forEach(notify => {
          expect(fixture.debugElement.nativeElement.innerText).toContain(notify.message);
        });

        expect(fixture.debugElement.nativeElement.innerText).toContain(mockNewNotification.message);
      });
    });

    describe('when occured new notification', () => {
      beforeEach(() => {
        spyOn(notifyService, 'loadNewNotifications').and.returnValue(of([mockNewNotification]));

        notifyService.notify(mockNewNotification);
        fixture.detectChanges();
      });

      it('should show "Получить новые уведомления" button', () => {
        expect(fixture.debugElement.nativeElement.innerText).toContain('Получить новые уведомления');
      });

      it('should show new notifications when clicked on "Получить новые уведомления" button', () => {
        fixture.debugElement.nativeElement.querySelector('#loadNewNotifications').click();
        fixture.detectChanges();

        expect(fixture.debugElement.nativeElement.innerText).toContain(mockNewNotification.message);
      });
    });

    it('should trigger navigation to "/logout"', () => {
      const router = TestBed.get(Router);
      const spy = spyOn(router, 'navigateByUrl');

      fixture.debugElement.nativeElement.querySelector('#logout').click();
      expect(`${spy.calls.first().args[0]}`).toBe('/logout');
    });
  });
});
