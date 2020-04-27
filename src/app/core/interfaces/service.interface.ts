import { ResponsibleUserI } from './responsible-user.interface';
import { CategoryI } from './category.interface';
import { TicketI } from './ticket.interface';
import { QuestionTicketI } from './question-ticket.interface';

export interface ServiceI {
  id: number;
  category_id: number;
  name: string;
  short_description: string;
  install: string;
  is_hidden: boolean;
  has_common_case: boolean;
  popularity: number;
  questionLimit?: number;
  category?: CategoryI;
  tickets?: TicketI[];
  question_tickets?: QuestionTicketI[];
  responsible_users?: ResponsibleUserI[];
}
