import { TestBed } from '@angular/core/testing';

import { ServicePolicy } from './service.policy';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { UserService } from '@shared/services/user/user.service';
import { StubUserService, user } from '@shared/services/user/user.service.stub';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { QuestionI } from '@interfaces/question.interface';
import { TicketI } from '@interfaces/ticket.interface';
import { ServiceI } from '@interfaces/service.interface';

describe('ServicePolicy', () => {
  let servicePolicy: ServicePolicy;
  let service: Service;
  let ticketResponsible: ResponsibleUserI;
  let serviceResponsible: ResponsibleUserI;
  let questionI: QuestionI;
  let serviceI: ServiceI;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useClass: StubUserService }]
    });

    ticketResponsible = { tn: user.tn } as ResponsibleUserI;
    serviceResponsible = { tn: user.tn } as ResponsibleUserI;
    questionI = { id: 1, ticket: { name: 'Тестовый вопрос', responsible_users: [ticketResponsible] } as TicketI } as QuestionI;
    serviceI = {
      name: 'Тестовая услуга',
      is_hidden: false,
      questions: [questionI],
      responsible_users: [serviceResponsible]
    } as ServiceI;

    servicePolicy = TestBed.get(ServicePolicy);
    service = ServiceFactory.create(serviceI);
    servicePolicy.object = service;
  });

  describe('#newTicket', () => {
    describe('when user has "service_responsible" role', () => {
      beforeEach(() => { user.role.name = 'service_responsible'; });

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
      beforeEach(() => { user.role.name = 'guest'; });

      it('should deny access', () => {
        expect(servicePolicy.newTicket()).toBeFalsy();
      });
    });
  });

  describe('#showFlags', () => {
    describe('when user has "service_responsible" role', () => {
      beforeEach(() => { user.role.name = 'service_responsible'; });

      describe('and when service belongs to user', () => {
        it('should grant access', () => {
          expect(servicePolicy.showFlags()).toBeTruthy();
        });
      });

      describe('when one of tickets belongs in service belongs to user' , () => {
        beforeEach(() => serviceResponsible.tn = 1);

        it('should grant access', () => {
          expect(servicePolicy.showFlags()).toBeTruthy();
        });
      });

      describe('and when service not belongs to user', () => {
        beforeEach(() => user.tn = 2);

        it('should deny access', () => {
          expect(servicePolicy.showFlags()).toBeFalsy();
        });
      });
    });

    describe('when user has "content_manager" role', () => {
      beforeEach(() => user.role.name = 'content_manager');

      it('should grant access', () => {
        expect(servicePolicy.showFlags()).toBeTruthy();
      });
    });

    describe('when user has "operator" role', () => {
      beforeEach(() => user.role.name = 'operator');

      it('should grant access', () => {
        expect(servicePolicy.showFlags()).toBeTruthy();
      });
    });

    describe('when user has another role', () => {
      beforeEach(() => { user.role.name = 'guest'; });

      it('should deny access', () => {
        expect(servicePolicy.showFlags()).toBeFalsy();
      });
    });
  });
});
