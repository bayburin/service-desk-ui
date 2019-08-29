import { BehaviorSubject } from 'rxjs';
import { TestBed } from '@angular/core/testing';

import { ServicePolicy } from './service.policy';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { UserService } from '@shared/services/user/user.service';
import { UserFactory } from '@shared/factories/user.factory';
import { User } from '@shared/models/user/user.model';

const user = UserFactory.create({ tn: 123, role: { name: 'service_responsible' } });

class StubUserService {
  user = new BehaviorSubject<User>(user);
}

describe('ServicePolicy', () => {
  let servicePolicy: ServicePolicy;
  let service: Service;
  let ticketResponsible;
  let serviceResponsible;
  let ticketI;
  let serviceI;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useClass: StubUserService }]
    });

    ticketResponsible = { tn: 123 };
    serviceResponsible = { tn: 123 };
    ticketI = { name: 'Тестовый вопрос', ticket_type: 'question', responsible_users: [ticketResponsible] };
    serviceI = { name: 'Тестовая услуга', is_hidden: false, tickets: [ticketI], responsible_users: [serviceResponsible] };

    servicePolicy = TestBed.get(ServicePolicy);
    service = ServiceFactory.create(serviceI);
    servicePolicy.object = service;
  });

  describe('#newTicket', () => {
    describe('when user has "service_responsible" role', () => {
      describe('and when service belongs to user', () => {
        it('should grant access', () => {
          expect(servicePolicy.newTicket()).toBeTruthy();
        });
      });

      describe('when one of tickets belongs in service belongs to user' , () => {
        beforeEach(() => serviceResponsible.tn = 1);

        it('should grant access', () => {
          expect(servicePolicy.newTicket()).toBeTruthy();
        });
      });

      describe('and when service not belongs to user', () => {
        beforeEach(() => user.tn = 1);

        it('should deny access', () => {
          expect(servicePolicy.newTicket()).toBeFalsy();
        });
      });
    });

    describe('when user has "content_manager" role', () => {
      beforeEach(() => user.role.name = 'content_manager');

      it('should grant access', () => {
        expect(servicePolicy.newTicket()).toBeTruthy();
      });
    });

    describe('when user has another role', () => {
      beforeEach(() => {
        user.role.name = 'guest';
      });

      it('should deny access', () => {
        expect(servicePolicy.newTicket()).toBeFalsy();
      });
    });
  });
});
