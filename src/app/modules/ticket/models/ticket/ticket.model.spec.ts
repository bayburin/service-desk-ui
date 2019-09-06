import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { QuestionState } from './ticket_states/question.state';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from './ticket.model';
import { ServiceI } from '@interfaces/service.interface';
import { TicketI } from '@interfaces/ticket.interface';
import { CaseState } from './ticket_states/case.state';
import { UserFactory } from '@shared/factories/user.factory';

describe('Ticket', () => {
  let serviceI: ServiceI;
  let ticketI: TicketI;
  let responsibleUserI;
  let ticket: Ticket;

  beforeEach(() => {
    responsibleUserI = {
      id: 1,
      tn: 123,
      responseable_type: 'Service',
      responseable_id: 1
    } as ResponsibleUserI;
    serviceI = {
      id: 2,
      name: 'Тестовая услуга',
      category_id: 3,
      responsible_users: [responsibleUserI]
    } as ServiceI;
    ticketI = {
      id: 1,
      service_id: 1,
      name: 'Тестовый вопрос',
      ticket_type: 'question',
      state: 'draft',
      is_hidden: false,
      sla: 2,
      popularity: 34,
      service: serviceI,
      responsible_users: [responsibleUserI]
    };
  });

  describe('Constructor', () => {
    it('should create instance of Ticket', () => {
      expect(new Ticket(ticketI)).toBeTruthy();
    });

    it('should create instance of parent service', () => {
      ticket = new Ticket(ticketI);

      expect(ticket.service instanceof Service).toBeTruthy();
    });

    it('should accept values', () => {
      ticket = new Ticket(ticketI);

      expect(ticket.id).toEqual(ticketI.id);
      expect(ticket.serviceId).toEqual(ticketI.service_id);
      expect(ticket.name).toEqual(ticketI.name);
      expect(ticket.ticketType).toEqual(ticketI.ticket_type);
      expect(ticket.isHidden).toEqual(ticketI.is_hidden);
      expect(ticket.sla).toEqual(ticketI.sla);
      expect(ticket.popularity).toEqual(ticketI.popularity);
      expect(ticket.responsibleUsers).toEqual([responsibleUserI]);
    });

    it('should create QuestionState if ticket_type is equal "question"', () => {
      ticket = new Ticket(ticketI);

      expect((ticket as any).type instanceof QuestionState).toBeTruthy();
    });

    it('should create CaseState if ticket_type is equal "case"', () => {
      ticketI.ticket_type = 'case';
      ticket = new Ticket(ticketI);

      expect((ticket as any).type instanceof CaseState).toBeTruthy();
    });
  });

  describe('For existing ticket', () => {
    beforeEach(() => {
      ticket = new Ticket(ticketI);
    });

    describe('#getShowLink', () => {
      it('should call "getShowLink" method on "state" object', () => {
        spyOn((ticket as any).type, 'getShowLink');
        ticket.getShowLink();

        expect((ticket as any).type.getShowLink).toHaveBeenCalledWith(ticket);
      });
    });

    describe('#pageComponent', () => {
      it('should call "getPageContentComponent" method on "state" object', () => {
        spyOn((ticket as any).type, 'getPageContentComponent');
        ticket.pageComponent();

        expect((ticket as any).type.getPageContentComponent).toHaveBeenCalled();
      });
    });

    describe('#isDraftState', () => {
      it('should return true if state is equal "draft"', () => {
        expect(ticket.isDraftState()).toBeTruthy();
      });
    });

    describe('#isPublishedState', () => {
      it('should return true if state is equal "draft"', () => {
        ticket.state = 'published';

        expect(ticket.isPublishedState()).toBeTruthy();
      });
    });

    describe('#isQuestionTicketType', () => {
      it('should return true if ticket_type is equal "question"', () => {
        expect(ticket.isQuestionTicketType()).toBeTruthy();
      });
    });

    describe('#isCaseTicketType', () => {
      it('should return true if ticket_type is equal "case"', () => {
        ticket.ticketType = 'case';
        expect(ticket.isCaseTicketType()).toBeTruthy();
      });
    });
  });

  describe('#isBelongsTo', () => {
    const tn = 1;
    const user = UserFactory.create({ tn: 1 });

    beforeEach(() => {
      ticket = new Ticket(ticketI);
      ticket.responsibleUsers.forEach(responsible => responsible.tn = tn );
    });

    it('should return true if user tn exists in "responsible_users" array', () => {
      expect(ticket.isBelongsTo(user)).toBeTruthy();
    });

    it('should return false if user tn not exists in "responsible_users" array', () => {
      user.tn = 17_664;

      expect(ticket.isBelongsTo(user)).toBeFalsy();
    });
  });
});
