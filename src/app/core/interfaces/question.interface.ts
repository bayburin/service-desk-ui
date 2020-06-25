import { AnswerI } from './answer.interface';
import { TicketI } from './ticket.interface';

export interface QuestionI {
  id: number;
  original_id: number;
  ticket: TicketI;
  correction?: QuestionI;
  answers?: AnswerI[];
}
