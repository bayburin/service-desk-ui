export interface AnswerAttachmentI {
  id: number;
  answer_id: number;
  filename: string;
  document?: File;
  loading?: boolean;
}
