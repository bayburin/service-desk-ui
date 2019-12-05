import { Answer } from '@modules/ticket/models/answer/answer.model';

export class AnswerFactory {
  static create(params) {
    return new Answer(params);
  }
}
