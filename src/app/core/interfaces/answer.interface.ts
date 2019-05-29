import { TicketI } from './ticket.interface';

export interface AnswerI {
  id: number;
  ticket_id: number;
  reason: string;
  answer: string;
  ticket?: TicketI;
}
