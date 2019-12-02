import { TestBed } from '@angular/core/testing';

import { TicketPolicy } from './ticket.policy';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { UserService } from '@shared/services/user/user.service';
import { StubUserService, user } from '@shared/services/user/user.service.stub';

describe('TicketPolicy', () => {
  let ticketPolicy: TicketPolicy;
  let ticket: Ticket;
  let ticketResponsible;
  let serviceResponsible;
  let ticketI;
  let serviceI;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useClass: StubUserService }]
    });

    ticketResponsible = { tn: user.tn };
    serviceResponsible = { tn: user.tn };
    serviceI = { name: 'Тестовая услуга', is_hidden: false, responsible_users: [serviceResponsible] };
    ticketI = { name: 'Тестовый вопрос', service: serviceI, ticket_type: 'question', responsible_users: [ticketResponsible] };

    ticketPolicy = TestBed.get(TicketPolicy);
    ticket = TicketFactory.create(ticketI);
    ticketPolicy.object = ticket;
  });

  describe('#showFlags', () => {
    describe('when user has "service_responsible" role', () => {
      beforeEach(() => { user.role.name = 'service_responsible'; });

      describe('and when ticket belongs to user', () => {
        it('should grant access', () => {
          expect(ticketPolicy.showFlags()).toBeTruthy();
        });
      });

      describe('and when service belongs to user and ticket is not', () => {
        beforeEach(() => ticket.responsibleUsers.forEach(u => u.tn = 123));

        it('should grant access', () => {
          expect(ticketPolicy.showFlags()).toBeTruthy();
        });
      });

      describe('and when ticket and service not belongs to user', () => {
        beforeEach(() => user.tn = 3);

        it('should deny access', () => {
          expect(ticketPolicy.showFlags()).toBeFalsy();
        });
      });
    });

    describe('when user has "content_manager" role', () => {
      beforeEach(() => user.role.name = 'content_manager');

      it('should grant access', () => {
        expect(ticketPolicy.showFlags()).toBeTruthy();
      });
    });

    describe('when user has "operator" role', () => {
      beforeEach(() => user.role.name = 'operator');

      it('should grant access', () => {
        expect(ticketPolicy.showFlags()).toBeTruthy();
      });
    });

    describe('when user has another role', () => {
      beforeEach(() => { user.role.name = 'guest'; });

      it('should deny access', () => {
        expect(ticketPolicy.showFlags()).toBeFalsy();
      });
    });
  });

  describe('#publish', () => {
    describe('when user has "content_manager" role', () => {
      beforeEach(() => { user.role.name = 'content_manager'; });

      describe('and when ticket has correction', () => {
        beforeEach(() => ticket.correction = TicketFactory.create({ id: 2, name: 'Тестовое исправление', ticket_type: 'question' }));

        it('should grant access', () => {
          expect(ticketPolicy.publish()).toBeTruthy();
        });
      });

      describe('and when ticket has "draft" state', () => {
        beforeEach(() => ticket.state = 'draft');

        it('should grant access', () => {
          expect(ticketPolicy.publish()).toBeTruthy();
        });
      });

      describe('and when ticket does not have correction and has "published" state', () => {
        beforeEach(() => {
          ticket.correction = null;
          ticket.state = 'published';
        });

        it('should deny access', () => {
          expect(ticketPolicy.publish()).toBeFalsy();
        });
      });
    });

    describe('when user has another role', () => {
      beforeEach(() => user.role.name = 'responsible_user');

      it('should deny access', () => {
        expect(ticketPolicy.publish()).toBeFalsy();
      });
    });
  });
});
