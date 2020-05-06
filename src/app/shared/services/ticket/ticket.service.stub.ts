import { of } from 'rxjs';

export class StubTicketService {
  loadDraftTicketsFor() { return of(''); }
  addDraftTickets() {}
  raiseRating() { return of(''); }
  downloadAttachmentFromAnswer() { return of(''); }
  createQuestion() { return of({}); }
  loadTags() { return of([]); }
  loadTicket() { return of({}); }
  updateTicket() { return of({}); }
  publishTickets() { return of({}); }
  removeDraftTicket() {}
  destroyTicket() {}
}
