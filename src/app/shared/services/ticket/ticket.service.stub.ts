import { of } from 'rxjs';

export class StubTicketService {
  loadDraftTickets() { return of(''); }
}
