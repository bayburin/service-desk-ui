import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';
import { QuestionI } from './question.interface';

export interface AnswerI {
  id: number;
  question_id: number;
  reason: string;
  answer: string;
  attachments: AnswerAttachmentI[];
  link: string;
  is_hidden: boolean;
  question?: QuestionI;
}
