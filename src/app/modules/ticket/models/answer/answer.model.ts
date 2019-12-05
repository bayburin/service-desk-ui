import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';

export class Answer {
  id: number;
  ticketId: number;
  reason: string;
  answer: string;
  attachments: AnswerAttachmentI[];
  link: string;
  isHidden: boolean;
  ticket?: Ticket;

  constructor(answer: any = {}) {
    this.id = answer.id;
    this.ticketId = answer.ticket_id;
    this.reason = answer.reason;
    this.answer = answer.answer;
    this.attachments = answer.attachments || [];
    this.link = answer.link;
    this.isHidden = answer.is_hidden;

    if (answer.ticket) {
      this.ticket = TicketFactory.create(answer.ticket);
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
