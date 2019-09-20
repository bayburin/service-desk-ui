import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { first, switchMap, finalize } from 'rxjs/operators';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { AnswerI } from '@interfaces/answer.interface';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';
import { toggleAnswer } from '@modules/ticket/animations/toggle-answer.animation';
import { AttachmentService } from '@shared/services/attachment/attachment.service';

@Component({
  selector: 'app-question-page-content',
  templateUrl: './question-page-content.component.html',
  styleUrls: ['./question-page-content.component.scss'],
  animations: [toggleAnswer]
})
export class QuestionPageContentComponent implements OnInit {
  @Input() data: Ticket;
  @Input() standaloneLink: boolean;
  ratingStream = new Subject<Ticket>();

  constructor(private ticketService: TicketService, private attachmentService: AttachmentService) { }

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
    if (this.standaloneLink) {
      return;
    }

    this.data.open = !this.data.open;
    this.ratingStream.next();
  }

  /**
   * Загружает выбранный файл с сервера.
   */
  downloadAttachment(attachment: AnswerAttachmentI): void {
    attachment.loading = true;
    this.attachmentService.downloadAttachment(attachment)
      .pipe(finalize(() => attachment.loading = false))
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
        });
  }

  trackByAnswer(index, answer: AnswerI) {
    return answer.id;
  }
}
