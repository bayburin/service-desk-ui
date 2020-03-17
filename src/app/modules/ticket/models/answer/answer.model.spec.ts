import { Ticket, TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { Answer } from './answer.model';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';
import { TicketI } from '@interfaces/ticket.interface';
import { AnswerI } from '@interfaces/answer.interface';

describe('Answer', () => {
  let answer: Answer;
  let answerI: AnswerI;
  let answerAttachmentI: AnswerAttachmentI;
  let ticketI: TicketI;

  beforeEach(() => {
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
      responsible_users: [],
    };
    answerAttachmentI = {
      id: 3,
      answer_id: 2,
      filename: 'Тестовое имя файла'
    };
    answerI = {
      id: 2,
      ticket_id: 1,
      reason: 'Тестовая причина',
      answer: 'Тестовый ответ',
      attachments: [answerAttachmentI],
      link: 'http://test_link',
      is_hidden: true,
      ticket: ticketI
    };
  });

  describe('Constructor', () => {
    it('should create instance of Answer', () => {
      expect(new Answer(answerI)).toBeTruthy();
    });

    it('should create instance of parent service', () => {
      answer = new Answer(answerI);

      expect(answer.ticket instanceof Ticket).toBeTruthy();
    });

    it('should accept values', () => {
      answer = new Answer(answerI);

      expect(answer.id).toEqual(answerI.id);
      expect(answer.ticketId).toEqual(answerI.ticket_id);
      expect(answer.reason).toEqual(answerI.reason);
      expect(answer.answer).toEqual(answerI.answer);
      expect(answer.attachments).toEqual(answerI.attachments);
      expect(answer.link).toEqual(answerI.link);
      expect(answer.isHidden).toEqual(answerI.is_hidden);
    });
  });

  describe('#addAttachment', () => {
    beforeEach(() => answer = new Answer(answerI));

    it('should add object to "attachments" array', () => {
      const newAttachment = { id: 22, answer_id: answer.id, filename: 'Новый файл' };

      answer.addAttachment(newAttachment);

      expect(answer.attachments.find(el => el === newAttachment)).toBeTruthy();
    });
  });

  describe('#removeAttachment', () => {
    beforeEach(() => answer = new Answer(answerI));

    it('should remove object from "attachment" array', () => {
      const newAttachment = { id: 22, answer_id: answer.id, filename: 'Новый файл' };

      answer.addAttachment(newAttachment);
      answer.removeAttachment(newAttachment);

      expect(answer.attachments.find(el => el === newAttachment)).toBeFalsy();
    });
  });
});
