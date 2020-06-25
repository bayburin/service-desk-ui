import { of } from 'rxjs';

export class StubQuestionService {
  loadDraftQuestionsFor() { return of(''); }
  addDraftQuestions() {}
  raiseRating() { return of(''); }
  downloadAttachmentFromAnswer() { return of(''); }
  createQuestion() { return of({}); }
  loadQuestion() { return of({}); }
  updateQuestion() { return of({}); }
  publishQuestions() { return of({}); }
  removeDraftQuestion() {}
  destroyQuestion() {}
}
