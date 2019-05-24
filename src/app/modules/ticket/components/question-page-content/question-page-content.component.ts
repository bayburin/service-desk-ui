import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { AnswerAttachmentI } from '@interfaces/answer_attachment.interface';

@Component({
  selector: 'app-question-page-content',
  templateUrl: './question-page-content.component.html',
  styleUrls: ['./question-page-content.component.scss']
})
export class QuestionPageContentComponent implements OnInit {
  @Input() data: Ticket;
  @Input() onlyLink: boolean;
  ratingStream = new Subject<Ticket>();

  constructor(private ticketService: TicketService) { }

  ngOnInit() {
    this.ratingStream
      .pipe(
        first(),
        switchMap(() => this.ticketService.raiseRating(this.data))
      )
      .subscribe();
  }

  /**
   * "Раскрывает" вопрос и отправляет запрос на сервер для изменения его рейтинга.
   */
  toggleTicket(): void {
    if (this.onlyLink) {
      return;
    }

    this.data.open = !this.data.open;
    this.ratingStream.next();
  }

  /**
   * Загружает выбранный файл.
   */
  downloadAttachment(attachment: AnswerAttachmentI) {
    this.ticketService.downloadAttachmentFromAnswer(attachment)
      .subscribe(
        fileData => {
          const url = window.URL.createObjectURL(fileData);
          const link = document.createElement('a');

          link.href = url;
          link.download = attachment.filename;
          link.click();

          // Для firefox необходимо отложить отзыв ObjectURL.
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            link.remove();
          }, 100);
        },
        error => console.log('Ошибка загрузки файла: ', error));
  }
}
