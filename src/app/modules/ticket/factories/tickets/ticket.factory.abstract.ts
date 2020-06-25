import { Question } from '@modules/ticket/models/question/question.model';
import { ClaimForm } from '@modules/ticket/models/claim-form/claim-form.model';

export abstract class TicketFactoryT {
  abstract create(params: any): Question | ClaimForm;
}
