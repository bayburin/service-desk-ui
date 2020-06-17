import { TicketFactoryT } from './ticket.factory.abstract';
import { Claim } from '@modules/ticket/models/claim/claim.model';

export class ClaimFactory extends TicketFactoryT {
  create(params: any = {}): Claim {
    return new Claim(params);
  }
}
