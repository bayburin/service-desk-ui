import { ServiceI } from '@interfaces/service.interface';

export interface TicketI {
  id: number;
  service_id: number;
  name: string;
  ticket_type: string;
  is_hidden: boolean;
  sla: number;
  popularity: number;
  service?: ServiceI;
  open?: boolean;
}
