import { Answer } from '@modules/ticket/models/answer/answer.model';
import { AnswerI } from '@interfaces/answer.interface';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { QuestionType } from './ticket_types/question.type';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket, TicketTypes } from './ticket.model';
import { ServiceI } from '@interfaces/service.interface';
import { TicketI } from '@interfaces/ticket.interface';
import { CaseType } from './ticket_types/case.type';
import { UserFactory } from '@shared/factories/user.factory';
import { PublishedState } from './states/published.state';
import { DraftState } from './states/draft.state';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';

describe('Ticket', () => {
  let serviceI: ServiceI;
  let ticketI: TicketI;
  let responsibleUserI: ResponsibleUserI;
  let ticket: Ticket;
  let correctionI: TicketI;

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
    correctionI = {
      id: 2,
      service_id: 1,
      original_id: 1,
      name: 'Исправленный вопрос',
      ticket_type: 'question',
      state: 'draft',
    } as TicketI;
    ticketI = {
      id: 1,
      service_id: 1,
      original_id: 0,
      name: 'Тестовый вопрос',
      ticket_type: TicketTypes.QUESTION,
      state: 'draft',
      is_hidden: false,
      sla: 2,
      to_approve: false,
      popularity: 34,
      service: serviceI,
      responsible_users: [responsibleUserI],
      correction: correctionI
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

    it('should create instances of nested answers', () => {
      const answers = [{ id: 1, answer: 'Тестовый ответ' } as AnswerI];
      ticketI.answers = answers;
      ticket = new Ticket(ticketI);

      expect(ticket.answers[0] instanceof Answer).toBeTruthy();
    });


    it('should create QuestionState if ticket_type is equal "question"', () => {
      ticket = new Ticket(ticketI);

      expect((ticket as any).type instanceof QuestionType).toBeTruthy();
    });

    it('should create CaseType if ticket_type is equal "case"', () => {
      ticketI.ticket_type = TicketTypes.CASE;
      ticket = new Ticket(ticketI);

      expect((ticket as any).type instanceof CaseType).toBeTruthy();
    });

    it('should create correction object', () => {
      ticket = new Ticket(ticketI);

      expect(ticket.correction.id).toEqual(correctionI.id);
    });

    it('should create original object into correction', () => {
      ticket = new Ticket(ticketI);

      expect(ticket.correction.original).toEqual(ticket);
    });
  });

  describe('"state" attribute', () => {
    beforeEach(() => {
      ticket = new Ticket(ticketI);
    });

    it('should set PublishedState', () => {
      ticket.state = 'published';

      expect(ticket.state).toEqual('published');
      expect(ticket.isPublishedState()).toBeTruthy();
      expect((ticket as any).questionState instanceof PublishedState).toBeTruthy();
    });

    it('should set DraftState', () => {
      ticket.state = 'draft';

      expect(ticket.state).toEqual('draft');
      expect(ticket.isDraftState()).toBeTruthy();
      expect((ticket as any).questionState instanceof DraftState).toBeTruthy();
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
        ticket.ticketType = TicketTypes.CASE;
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

  describe('#isBelongsByServiceTo', () => {
    const user = UserFactory.create({ tn: 1 });

    beforeEach(() => {
      ticket = new Ticket(ticketI);
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
      ticket = new Ticket(ticketI);
      ticket.state = 'draft';
    });

    it('should change state to "published"', () => {
      ticket.publish();

      expect(ticket.isPublishedState).toBeTruthy();
    });
  });

  describe('#getResponsibleUsersTn', () => {
    beforeEach(() => {
      ticket = new Ticket(ticketI);
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

    beforeEach(() => {
      ticket = new Ticket(ticketI);
      ticket.correction.responsibleUsers.push({ tn: 12345 } as ResponsibleUserI);
    });

    it('should associate "responsibleUsers -> details" attribute with data from occured array', () => {
      ticket.associateResponsibleUserDetails(details);

      expect(ticket.responsibleUsers[0].details).toEqual(details[0]);
    });

    it('should associate "responsibleUsers -> details" attribute with data from occured array for correction', () => {
      ticket.associateResponsibleUserDetails(details);

      expect(ticket.correction.responsibleUsers[0].details).toEqual(details[1]);
    });

    describe('when correction is not exist', () => {
      beforeEach(() => ticket.correction = null);

      it('should associate "responsibleUsers -> details" attribute with data from occured array', () => {
        ticket.associateResponsibleUserDetails(details);

        expect(ticket.responsibleUsers[0].details).toEqual(details[0]);
      });
    });
  });

  describe('#hasId', () => {
    beforeEach(() => ticket = new Ticket(ticketI));

    it('should return true if received id is equal ticketId', () => {
      expect(ticket.hasId(ticket.id)).toBeTruthy();
    });

    describe('when ticket has draft state', () => {
      beforeEach(() => ticket = ticket.correction);

      it('should return true if received id is equal id of original', () => {
        expect(ticket.hasId(ticket.originalId)).toBeTruthy();
      });
    });

    describe('when ticket has published state', () => {
      beforeEach(() => ticket.publish());

      it('should return true if received id is equal id of correction', () => {
        expect(ticket.hasId(ticket.correction.id)).toBeTruthy();
      });
    });

    it('should return false if received id is not equal any type of current ticket', () => {
      expect(ticket.hasId(-12345)).toBeFalsy();
    });
  });
});
