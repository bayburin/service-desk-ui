import { ServiceI } from './service.interface';
import { TicketI } from './ticket.interface';

export interface CategoryI {
  id: number;
  name: string;
  short_description: string;
  popularity: number;
  icon_name: string;
  services?: ServiceI[];
  tickets?: TicketI[];
  faq?: TicketI[];
}
