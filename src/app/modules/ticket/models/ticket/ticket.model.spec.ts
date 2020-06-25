import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket, TicketTypes, TicketStates } from './ticket.model';
import { ServiceI } from '@interfaces/service.interface';
import { TicketI } from '@interfaces/ticket.interface';
import { UserFactory } from '@shared/factories/user.factory';
import { PublishedState } from './states/published.state';
import { DraftState } from './states/draft.state';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';

class CustomTicket extends Ticket {
  getShowLink() { return 'getShowLink'; }
  pageComponent() { return 'pageComponent'; }
}

describe('Ticket', () => {
  let serviceI: ServiceI;
  let ticketI: TicketI;
  let responsibleUserI: ResponsibleUserI;
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
      // original_id: 0,
      name: 'Тестовый вопрос',
      ticketable_id: 1,
      ticketable_type: TicketTypes.QUESTION,
      state: 'draft',
      is_hidden: false,
      sla: 2,
      popularity: 34,
      service: serviceI,
      responsible_users: [responsibleUserI],
    };
  });

  describe('Constructor', () => {
    it('should create instance of Ticket', () => {
      expect(new CustomTicket(ticketI)).toBeTruthy();
    });

    it('should create instance of parent service', () => {
      ticket = new CustomTicket(ticketI);

      expect(ticket.service instanceof Service).toBeTruthy();
    });

    it('should accept values', () => {
      ticket = new CustomTicket(ticketI);

      expect(ticket.ticketId).toEqual(ticketI.id);
      expect(ticket.serviceId).toEqual(ticketI.service_id);
      expect(ticket.name).toEqual(ticketI.name);
      expect(ticket.isHidden).toEqual(ticketI.is_hidden);
      expect(ticket.sla).toEqual(ticketI.sla);
      expect(ticket.popularity).toEqual(ticketI.popularity);
      expect(ticket.responsibleUsers).toEqual([responsibleUserI]);
    });
  });

  describe('"state" attribute', () => {
    beforeEach(() => ticket = new CustomTicket(ticketI));

    it('should set PublishedState', () => {
      ticket.state = TicketStates.PUBLISHED;

      expect(ticket.state).toEqual('published');
      expect(ticket.isPublishedState()).toBeTruthy();
      expect((ticket as any).ticketState instanceof PublishedState).toBeTruthy();
    });

    it('should set DraftState', () => {
      ticket.state = TicketStates.DRAFT;

      expect(ticket.state).toEqual('draft');
      expect(ticket.isDraftState()).toBeTruthy();
      expect((ticket as any).ticketState instanceof DraftState).toBeTruthy();
    });
  });

  describe('For existing ticket', () => {
    beforeEach(() => ticket = new CustomTicket(ticketI));

    describe('#isDraftState', () => {
      it('should return true if state is equal "draft"', () => {
        expect(ticket.isDraftState()).toBeTruthy();
      });
    });

    describe('#isPublishedState', () => {
      it('should return true if state is equal "draft"', () => {
        ticket.state = TicketStates.PUBLISHED;

        expect(ticket.isPublishedState()).toBeTruthy();
      });
    });
  });

  describe('#isBelongsTo', () => {
    const tn = 1;
    const user = UserFactory.create({ tn: 1 });

    beforeEach(() => {
      ticket = new CustomTicket(ticketI);
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

  describe('#isBelongsByServiceTo', () => {
    const user = UserFactory.create({ tn: 1 });

    beforeEach(() => {
      ticket = new CustomTicket(ticketI);
    });

    it('should return false if service is null', () => {
      ticket.service = null;

      expect(ticket.isBelongsByServiceTo(user)).toBeFalsy();
    });

    it('should return true if "isBelongsTo" method for service returns true', () => {
      spyOn(ticket.service, 'isBelongsTo').and.returnValue(true);

      expect(ticket.isBelongsByServiceTo(user)).toBeTruthy();
    });
  });

  describe('#publish', () => {
    beforeEach(() => {
      ticket = new CustomTicket(ticketI);
      ticket.state = TicketStates.DRAFT;
    });

    it('should change state to "published"', () => {
      ticket.publish();

      expect(ticket.isPublishedState).toBeTruthy();
    });
  });

  describe('#getResponsibleUsersTn', () => {
    beforeEach(() => {
      ticket = new CustomTicket(ticketI);
      ticket.responsibleUsers.push({ tn: 12345 } as ResponsibleUserI);
    });

    it('should return array of "tn" attributes', () => {
      expect(ticket.getResponsibleUsersTn()).toEqual([responsibleUserI.tn, 12345]);
    });
  });

  describe('#associateResponsibleUserDetails', () => {
    const details = [
      { tn: 123, full_name: 'ФИО 1' } as ResponsibleUserDetailsI,
      { tn: 12345, full_name: 'ФИО 2' } as ResponsibleUserDetailsI
    ];

    beforeEach(() => ticket = new CustomTicket(ticketI));

    it('should associate "responsibleUsers -> details" attribute with data from occured array', () => {
      ticket.associateResponsibleUserDetails(details);

      expect(ticket.responsibleUsers[0].details).toEqual(details[0]);
    });
  });
});
