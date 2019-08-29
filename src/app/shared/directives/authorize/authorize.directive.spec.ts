import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Component, TemplateRef, ViewContainerRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import { UserFactory } from 'app/core/factories/user.factory';
import { ServicePolicy } from '@shared/policies/service/service.policy';
import { TicketPolicy } from '@shared/policies/ticket/ticket.policy';
import { AuthorizeDirective } from './authorize.directive';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { UserService } from '@shared/services/user/user.service';
import { User } from 'app/core/models/user/user.model';

@Component({
  template: `<div *appAuthorize="[service, 'newService']">Тестовый компонент</div>`
})
export class TestContainerComponent {
  service = ServiceFactory.create({ id: 1, name: 'Тестовый сервис', user_responsibles: [{ tn: 17_664 }] });
}

class StubUserService {
  user = new BehaviorSubject<User>(UserFactory.create({ tn: 17_664 }));
}

class StubTicketPolicy {
  authorize() {}
}

class StubServicePolicy {
  authorize() {}
}

describe('AuthorizeDirective', () => {
  let fixture: ComponentFixture<TestContainerComponent>;
  let component: TestContainerComponent;
  let directive: AuthorizeDirective;
  let servicePolicy: ServicePolicy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestContainerComponent, AuthorizeDirective],
      providers: [
        AuthorizeDirective,
        TemplateRef,
        ViewContainerRef,
        { provide: UserService, useClass: StubUserService },
        { provide: TicketPolicy, useClass: StubTicketPolicy },
        { provide: ServicePolicy, useClass: StubServicePolicy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestContainerComponent);
    component = fixture.componentInstance;
    directive = TestBed.get(AuthorizeDirective);
    servicePolicy = TestBed.get(ServicePolicy);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('when object belongs to user', () => {
    it('should show element', () => {
      spyOn(servicePolicy, 'authorize').and.returnValue(true);
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual('Тестовый компонент');
    });
  });

  describe('when object not belong to user', () => {
    it('should show element', () => {
      spyOn(servicePolicy, 'authorize').and.returnValue(false);
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual('');
    });
  });
});
