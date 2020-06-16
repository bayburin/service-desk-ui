import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NotifyComponent } from './notify.component';
import { NotificationService } from '@shared/services/notification/notification.service';
import { StreamService } from '@shared/services/stream/stream.service';
import { NotifyFactory } from '@shared/factories/notify.factory';
import { StubNotificationService } from '@shared/services/notification/notification.service.stub';

const notifyI = { id: 1, tn: 1234, body: { message: 'Заявка отклонена' }, event_type: 'claim' };
const notify = NotifyFactory.create(notifyI);

class StubStreamService {
  channelServer = {
    channel: (channelName) => {
      return {
        received: () => of(notifyI),
        unsubscribe: () => {}
      };
    }
  };
}

describe('NotifyComponent', () => {
  let component: NotifyComponent;
  let fixture: ComponentFixture<NotifyComponent>;
  let notifyService;
  let streamService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule, NoopAnimationsModule, HttpClientTestingModule],
      declarations: [NotifyComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: NotificationService, useClass: StubNotificationService },
        { provide: StreamService, useClass: StubStreamService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyComponent);
    component = fixture.componentInstance;

    notifyService = TestBed.get(NotificationService);
    streamService = TestBed.get(StreamService);
    spyOn(notifyService, 'notify').and.callFake((notification) => {
      notifyService.notifications.push(notification);
    });
  });

// Unit ====================================================================================================================================

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should init notifications array', () => {
    fixture.detectChanges();

    expect(component.notifications).toBe(notifyService.notifications);
  });

  it('should connects to server through actioncable', () => {
    const spy = spyOn(streamService.channelServer, 'channel').and.callThrough();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith((component as any).channelName);
  });

  it('should call "notify" method with Notify class for NotificationService if occured notification', () => {
    fixture.detectChanges();
    expect(notifyService.notify).toHaveBeenCalledWith(notify);
  });

  it('should unsubscribe from channel if component destroyed', () => {
    fixture.detectChanges();
    const spy = spyOn((component as any).channel, 'unsubscribe');

    fixture.destroy();
    expect(spy).toHaveBeenCalled();
  });

  describe('#close', () => {
    it('should remove notification from notifications array', () => {
      fixture.detectChanges();
      component.close(notify);

      expect(component.notifications.length).toEqual(0);
    });
  });

// Shallow tests ===========================================================================================================================

  describe('#shallow tests', () => {
    it('should show notification', () => {
      fixture.detectChanges();
      const html = fixture.debugElement.nativeElement.innerHTML;

      expect(html).toContain(notify.message);
    });

    it('should close notification if clicked on button', () => {
      fixture.detectChanges();
      const element = fixture.debugElement.nativeElement;
      element.querySelector('.close').click();
      fixture.detectChanges();

      expect(element.innerHTML).not.toContain(notify.message);
    });

    it('should close notification automatically', fakeAsync(() => {
      fixture.detectChanges();
      const element = fixture.debugElement.nativeElement;
      tick(notify.delay);
      fixture.detectChanges();

      expect(element.innerHTML).not.toContain(notify.message);
    }));
  });
});
