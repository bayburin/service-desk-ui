export interface AnswerAttachmentI {
  id: number;
  answer_id: number;
  filename: string;
  document?: File;
  loadingDownload?: boolean;
  loadingRemove?: boolean;
}
