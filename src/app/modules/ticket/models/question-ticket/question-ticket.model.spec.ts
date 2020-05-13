import { QuestionTicket } from './question-ticket.model';
import { TicketI } from '@interfaces/ticket.interface';
import { ServiceI } from '@interfaces/service.interface';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { TicketTypes } from '../ticket/ticket.model';
import { AnswerI } from '@interfaces/answer.interface';
import { Answer } from '../answer/answer.model';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { QuestionTicketI } from '@interfaces/question-ticket.interface';

describe('QuestionTicket', () => {
  let serviceI: ServiceI;
  let ticketI: TicketI;
  let responsibleUserI: ResponsibleUserI;
  let ticket: QuestionTicket;
  let correctionTicketI: TicketI;
  let correctionI: QuestionTicketI;
  let questionTicketI: QuestionTicketI;

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
    correctionTicketI = {
      id: 2,
      service_id: 1,
      name: 'Исправленный вопрос',
      ticket_type: TicketTypes.QUESTION,
      state: 'draft'
    } as TicketI;
    correctionI = {
      id: 2,
      original_id: 1,
      ticket: correctionTicketI
    };
    ticketI = {
      id: 1,
      service_id: 1,
      name: 'Тестовый вопрос',
      ticket_type: TicketTypes.QUESTION,
      ticketable_id: 1,
      ticketable_type: TicketTypes.QUESTION,
      state: 'draft',
      is_hidden: false,
      sla: 2,
      popularity: 34,
      service: serviceI,
      responsible_users: [responsibleUserI],
    };
    questionTicketI = {
      id: 1,
      original_id: null,
      ticket: ticketI,
      correction: correctionI
    };
  });

  it('should set "question" ticketType attribute', () => {
    ticket = new QuestionTicket(questionTicketI);

    expect(ticket.ticketType).toEqual(TicketTypes.QUESTION);
  });

  describe('Constructor', () => {
    it('should create instance of QuestionTicket', () => {
      expect(new QuestionTicket(questionTicketI)).toBeTruthy();
    });

    it('should accept values', () => {
      const question = new QuestionTicket(questionTicketI);

      expect(question.id).toEqual(questionTicketI.id);
    });

    it('should create instances of nested answers', () => {
      const answers = [{ id: 1, answer: 'Тестовый ответ' } as AnswerI];
      questionTicketI.answers = answers;
      ticket = new QuestionTicket(questionTicketI);

      expect(ticket.answers[0] instanceof Answer).toBeTruthy();
    });

    it('should create correction object', () => {
      ticket = new QuestionTicket(questionTicketI);

      expect(ticket.correction.id).toEqual(correctionI.id);
    });

    it('should create original object into correction', () => {
      ticket = new QuestionTicket(questionTicketI);

      expect(ticket.correction.original).toEqual(ticket);
    });
  });

  describe('#hasId', () => {
    beforeEach(() => ticket = new QuestionTicket(questionTicketI));

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

  describe('#associateResponsibleUserDetails', () => {
    const details = [
      { tn: 123, full_name: 'ФИО 1' } as ResponsibleUserDetailsI,
      { tn: 12345, full_name: 'ФИО 2' } as ResponsibleUserDetailsI
    ];

    beforeEach(() => {
      ticket = new QuestionTicket(questionTicketI);
      ticket.correction.responsibleUsers.push({ tn: 12345 } as ResponsibleUserI);
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
});
