import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  constructor(private http: HttpClient) { }

  /**
   * Загрузить файл на сервер.
   *
   * @param attachment - объект AnswerAttachment, содержащий файл
   */
  uploadAttachment(attachment: AnswerAttachmentI): Observable<any> {
    const formData = new FormData();
    const httpHeaders = new HttpHeaders().set('InterceptorSkipJSONHeaders', '');
    const uploadAttachmentUrl = `${environment.serverUrl}/api/v1/answers/${attachment.answer_id}/answer_attachments`;

    formData.append('answer_id', `${attachment.answer_id}`);
    formData.append('document', attachment.document);
    return this.http.post(uploadAttachmentUrl, formData, { reportProgress: true, observe: 'events', headers: httpHeaders });
  }

  /**
   * Скачать файл с сервера.
   *
   * @param attachment - объект AnswerAttachment, содержащий имя файла
   */
  downloadAttachment(attachment: AnswerAttachmentI): Observable<Blob> {
    const downloadAttachmentUrl = `${environment.serverUrl}/api/v1/answers/${attachment.answer_id}/answer_attachments/${attachment.id}`;

    return this.http.get(downloadAttachmentUrl, { responseType: 'blob' });
  }

  /**
   * Удалить файл
   */
  removeAttachment(attachment: AnswerAttachmentI) {
    const removeAttachmentUrl = `${environment.serverUrl}/api/v1/answers/${attachment.answer_id}/answer_attachments/${attachment.id}`;

    return this.http.delete(removeAttachmentUrl);
  }
}
