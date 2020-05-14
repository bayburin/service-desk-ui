import { of } from 'rxjs';

export class StubQuestionTicketService {
  loadDraftQuestionsFor() { return of(''); }
  addDraftTickets() {}
  raiseRating() { return of(''); }
  downloadAttachmentFromAnswer() { return of(''); }
  createQuestion() { return of({}); }
  loadQuestion() { return of({}); }
  updateQuestion() { return of({}); }
  publishQuestions() { return of({}); }
  removeDraftTicket() {}
  destroyQuestion() {}
}
