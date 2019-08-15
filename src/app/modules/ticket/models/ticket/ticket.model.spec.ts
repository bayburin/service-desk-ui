import { QuestionState } from './ticket_states/question_state';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from './ticket.model';
import { ServiceI } from '@interfaces/service.interface';
import { TicketI } from '@interfaces/ticket.interface';
import { CaseState } from './ticket_states/case_state';

describe('Ticket', () => {
  let serviceI: ServiceI;
  let ticketI: TicketI;
  let ticket: Ticket;

  beforeEach(() => {
    serviceI = {
      id: 2,
      name: 'Тестовая услуга',
      category_id: 3
    } as ServiceI;
    ticketI = {
      id: 1,
      service_id: 1,
      name: 'Тестовый вопрос',
      ticket_type: 'question',
      is_hidden: false,
      sla: 2,
      popularity: 34,
      service: serviceI
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
    });

    it('should create QuestionState if ticket_type is equal "question"', () => {
      ticket = new Ticket(ticketI);

      expect((ticket as any).state instanceof QuestionState).toBeTruthy();
    });

    it('should create CaseState if ticket_type is equal "case"', () => {
      ticketI.ticket_type = 'case';
      ticket = new Ticket(ticketI);

      expect((ticket as any).state instanceof CaseState).toBeTruthy();
    });
  });

  describe('For existing ticket', () => {
    beforeEach(() => {
      ticket = new Ticket(ticketI);
    });

    describe('#getShowLink', () => {
      it('should call "getShowLink" method on "state" object', () => {
        spyOn((ticket as any).state, 'getShowLink');
        ticket.getShowLink();

        expect((ticket as any).state.getShowLink).toHaveBeenCalledWith(ticket);
      });
    });

    describe('#pageComponent', () => {
      it('should call "getPageContentComponent" method on "state" object', () => {
        spyOn((ticket as any).state, 'getPageContentComponent');
        ticket.pageComponent();

        expect((ticket as any).state.getPageContentComponent).toHaveBeenCalled();
      });
    });

    describe('#isQuestion', () => {
      it('should return true if ticket_type is equal "question"', () => {
        expect(ticket.isQuestion()).toBeTruthy();
      });
    });

    describe('#isCase', () => {
      it('should return true if ticket_type is equal "case"', () => {
        ticket.ticketType = 'case';
        expect(ticket.isCase()).toBeTruthy();
      });
    });
  });
});
