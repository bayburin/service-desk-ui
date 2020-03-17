import { AnswerI } from './answer.interface';
import { ServiceI } from '@interfaces/service.interface';
import { ResponsibleUserI } from './responsible-user.interface';
import { TagI } from './tag.interface';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export interface TicketI {
  id: number;
  service_id: number;
  original_id: number;
  name: string;
  ticket_type: TicketTypes;
  state: string;
  is_hidden: boolean;
  sla: number;
  to_approve: boolean;
  popularity: number;
  answers?: AnswerI[];
  tags?: TagI[];
  service?: ServiceI;
  correction?: TicketI;
  responsible_users?: ResponsibleUserI[];
  open?: boolean;
}
