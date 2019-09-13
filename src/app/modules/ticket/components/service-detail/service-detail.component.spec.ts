import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { ServiceDetailComponent } from './service-detail.component';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketI } from '@interfaces/ticket.interface';
import { UserService } from '@shared/services/user/user.service';
import { AuthorizeDirective } from '@shared/directives/authorize/authorize.directive';
import { StubUserService, roleI, user } from '@shared/services/user/user.service.stub';

describe('ServiceDetailComponent', () => {
  let component: ServiceDetailComponent;
  let fixture: ComponentFixture<ServiceDetailComponent>;
  const tickets = [
    { id: 1, service_id: 1, name: 'Тестовый вопрос 1', ticket_type: 'question' },
    { id: 2, service_id: 2, name: 'Тестовая заявка', ticket_type: 'case' }
  ] as TicketI[];
  const service = ServiceFactory.create({
    id: 1,
    category_id: 1,
    name: 'Тестовая услуга',
    tickets: tickets,
    user_responsibles: [{ tn: 12_123 }]
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule],
      declarations: [ServiceDetailComponent, AuthorizeDirective],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: UserService, useClass: StubUserService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDetailComponent);
    component = fixture.componentInstance;
    component.service = service;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show app-section-header component', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('app-section-header')).toBeTruthy();
  });

  it('should show app-dynamic-template-content component', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelectorAll('app-dynamic-template-content').length).toEqual(tickets.length);
  });

  describe('when user has "content_manager" role or responsible for this service', () => {
    beforeEach(() => {
      user.role.name = 'content_manager';
      fixture.detectChanges();
    });

    it('should open admin mode', inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigateByUrl');
      fixture.debugElement.nativeElement.querySelector('#adminMode').click();

      expect(`${spy.calls.first().args[0]}`).toEqual('/admin/tickets');
    }));
  });
});
