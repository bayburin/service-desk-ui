import { ServiceI } from '@interfaces/service.interface';
import { ResponsibleUserI } from './responsible-user.interface';
import { TagI } from './tag.interface';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export interface TicketI {
  id: number;
  service_id: number;
  name: string;
  ticket_type: TicketTypes;
  ticketable_id: number;
  ticketable_type: TicketTypes;
  state: string;
  is_hidden: boolean;
  sla: number;
  popularity: number;
  tags?: TagI[];
  service?: ServiceI;
  responsible_users?: ResponsibleUserI[];
  open?: boolean;
}
