import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';
import { Question } from '../question/question.model';

export class Answer {
  id: number;
  questionId: number;
  reason: string;
  answer: string;
  attachments: AnswerAttachmentI[];
  link: string;
  isHidden: boolean;
  question?: Question;

  constructor(answer: any = {}) {
    this.id = answer.id;
    this.questionId = answer.question_id;
    this.reason = answer.reason;
    this.answer = answer.answer;
    this.attachments = answer.attachments || [];
    this.link = answer.link;
    this.isHidden = answer.is_hidden;

    if (answer.question) {
      this.question = TicketFactory.create(TicketTypes.QUESTION, answer.question);
    }
  }

  /**
   * Добавляет объект AnswerAttachmentI к списку файлов.
   *
   * @param atttachment - добавляемый объект.
   */
  addAttachment(attachment: AnswerAttachmentI) {
    this.attachments.push(attachment);
  }

  /**
   * Удаляет объект AnswerAttachmentI из списка файлов.
   *
   * @param attachment - удаляемый объект.
   */
  removeAttachment(attachment: AnswerAttachmentI) {
    this.attachments.splice(this.attachments.indexOf(attachment), 1);
  }
}
