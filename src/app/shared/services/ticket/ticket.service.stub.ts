import { of } from 'rxjs';

export class StubTicketService {
  raiseRating() { return of(''); }
  downloadAttachmentFromAnswer() { return of(''); }
  createTicket() { return of({}); }
  loadTags() { return of([]); }
}
