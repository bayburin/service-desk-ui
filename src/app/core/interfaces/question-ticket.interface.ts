import { AnswerI } from './answer.interface';
import { TicketI } from './ticket.interface';

export interface QuestionTicketI {
  id: number;
  original_id: number;
  ticket: TicketI;
  correction?: QuestionTicketI;
  answers?: AnswerI[];
}
