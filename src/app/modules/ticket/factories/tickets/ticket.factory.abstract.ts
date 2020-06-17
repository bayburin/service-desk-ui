import { Question } from '@modules/ticket/models/question/question.model';
import { Claim } from '@modules/ticket/models/claim/claim.model';

export abstract class TicketFactoryT {
  abstract create(params: any): Question | Claim;
}
