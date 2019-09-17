import { AnswerI } from './answer.interface';
import { ServiceI } from '@interfaces/service.interface';
import { ResponsibleUserI } from './responsible-user.interface';
import { TagI } from './tag.interface';

export interface TicketI {
  id: number;
  service_id: number;
  name: string;
  ticket_type: string;
  state: string;
  is_hidden: boolean;
  sla: number;
  popularity: number;
  answers?: AnswerI[];
  tags?: TagI[];
  service?: ServiceI;
  responsible_users?: ResponsibleUserI[];
  open?: boolean;
}
