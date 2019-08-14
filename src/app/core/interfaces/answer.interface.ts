import { AnswerAttachmentI } from '@interfaces/answer_attachment.interface';
import { TicketI } from './ticket.interface';

export interface AnswerI {
  id: number;
  ticket_id: number;
  reason: string;
  answer: string;
  attachments: AnswerAttachmentI[];
  link: string;
  ticket?: TicketI;
}
