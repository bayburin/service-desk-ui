import { TicketFactoryT } from './ticket.factory.abstract';
import { Question } from '@modules/ticket/models/question/question.model';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

export class QuestionFactory extends TicketFactoryT {
  create(params: any = {}): Question {
    return new Question(params);
  }
}
