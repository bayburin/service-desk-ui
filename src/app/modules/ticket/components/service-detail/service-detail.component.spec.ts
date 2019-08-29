import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ServiceDetailComponent } from './service-detail.component';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketI } from '@interfaces/ticket.interface';
import { UserFactory } from 'app/core/factories/user.factory';
import { User } from 'app/core/models/user/user.model';
import { RoleI } from '@interfaces/role.interface';
import { UserService } from '@shared/services/user/user.service';
import { AuthorizeDirective } from '@shared/directives/authorize/authorize.directive';

const role = {
  id: 1,
  name: 'content_manager'
} as RoleI;
const UserI = {
  tn: 12_123,
  fio: 'Форточкина Клавдия Ивановна',
  dept: 714,
  role_id: 1,
  role: role
};
const user = UserFactory.create(UserI);

class StubUserService {
  user = new BehaviorSubject<User>(user);
}

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show app-section-header component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-section-header')).toBeTruthy();
  });

  it('should show app-dynamic-template-content component', () => {
    expect(fixture.debugElement.nativeElement.querySelectorAll('app-dynamic-template-content').length).toEqual(tickets.length);
  });

  describe('when user has admin role or responsible for this service', () => {
    it('should redirect to form to create a new question', inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigateByUrl');
      fixture.debugElement.nativeElement.querySelector('#newQuestion').click();

      expect(`${spy.calls.first().args[0]}`).toEqual('/admin/new');
    }));
  });
});
