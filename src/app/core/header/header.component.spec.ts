import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { HeaderComponent } from './header.component';
import { UserService } from '@shared/services/user/user.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { StreamService } from '@shared/services/stream/stream.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StubUserService, user } from '@shared/services/user/user.service.stub';
import { StubNotificationService } from '@shared/services/notification/notification.service.stub';

class StubStreamService {
  channelServer = {
    channel: () => {
      return {
        received: () => of(5),
        connected: () => of({}),
        unsubscribe: () => {},
        perform: () => {}
      };
    }
  };
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userService: UserService;
  let notifyService: NotificationService;
  let streamService: StreamService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule],
      declarations: [HeaderComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: UserService, useClass: StubUserService },
        { provide: NotificationService, useClass: StubNotificationService },
        { provide: StreamService, useClass: StubStreamService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    notifyService = TestBed.get(NotificationService);
    streamService = TestBed.get(StreamService);
  });

// Unit ====================================================================================================================================

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should receive user data from UserService', () => {
    fixture.detectChanges();

    expect(component.user).toEqual(userService.user);
  });

  it('should receive notificationCount from NotificationService', () => {
    fixture.detectChanges();

    expect(component.notificationCount).toEqual(notifyService.notificationCount);
  });

  it('should connects to server through actioncable', () => {
    spyOn(streamService.channelServer, 'channel').and.callThrough();
    fixture.detectChanges();

    expect(streamService.channelServer.channel).toHaveBeenCalledWith((component as any).channelName);
  });

  it('should receive count of new notifications', () => {
    fixture.detectChanges();

    expect(component.notificationCount.value).toEqual(5);
  });

  it('should unsubscribe from channel if component destroyed', () => {
    fixture.detectChanges();
    spyOn((component as any).channel, 'unsubscribe');

    fixture.destroy();
    expect((component as any).channel.unsubscribe).toHaveBeenCalled();
  });

  describe('#toggleCollapsed', () => {
    it('should change value of "collapsed" variable', () => {
      fixture.detectChanges();
      const old = component.collapsed;
      component.toggleCollapsed();

      expect(old).not.toEqual(component.collapsed);
    });
  });

  describe('#clearNotificationCount', () => {
    it('should clear value of notificationCount object', () => {
      fixture.detectChanges();
      component.clearNotificationCount();

      expect(component.notificationCount.value).toEqual(0);
    });
  });

// Shallow tests ===========================================================================================================================

  describe('Shallow tests', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show user fio', () => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(user.fio);
    });

    it('should show count of notifications', () => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(`+${5}`);
    });

    it('should have "categoires" link', () => {
      expect(fixture.debugElement.nativeElement.querySelector('a.nav-link[href="/categories"]')).toBeTruthy();
    });

    // it('should have "services" link', () => {
    //   expect(fixture.debugElement.nativeElement.querySelector('a.nav-link[href="/services"]')).toBeTruthy();
    // });

    it('should have "cases" link', () => {
      expect(fixture.debugElement.nativeElement.querySelector('a.nav-link[href="/cases"]')).toBeTruthy();
    });

    // it('should have "new cases" link', () => {
    //   expect(fixture.debugElement.nativeElement.querySelector('a.nav-link[href="/cases/new"]')).toBeTruthy();
    // });

    it('should have "search" link', () => {
      expect(fixture.debugElement.nativeElement.querySelector('a.nav-link[href="/search"]')).toBeTruthy();
    });

    it('should show user dashboard menu', () => {
      fixture.debugElement.nativeElement.querySelector('#parentDashboardElement').click();
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('app-user-dashboard-menu')).toBeTruthy();
    });
  });
});
