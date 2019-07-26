import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { environment } from 'environments/environment';
import { TicketI } from '@interfaces/ticket.interface';
import { AnswerAttachmentI } from '@interfaces/answer_attachment.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private http: HttpClient) {}

  /**
   * Отправляет запрос на сервер на изменение рейтинга указанного вопроса.
   */
  raiseRating(ticket: Ticket): Observable<TicketI> {
    const raiseRatingUrl = `${environment.serverUrl}/api/v1/services/${ticket.serviceId}/tickets/${ticket.id}`;

    return this.http.get<TicketI>(raiseRatingUrl);
  }

  /**
   * Загружает с сервера указанный файл.
   */
  downloadAttachmentFromAnswer(attachment: AnswerAttachmentI): Observable<Blob> {
    const downloadAttachmentUrl = `${environment.serverUrl}/api/v1/answers/${attachment.answer_id}/attachments/${attachment.id}`;

    return this.http.get(downloadAttachmentUrl, { responseType: 'blob' });
  }
}
