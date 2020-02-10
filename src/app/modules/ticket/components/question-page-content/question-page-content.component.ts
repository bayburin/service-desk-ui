import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { first, switchMap, finalize } from 'rxjs/operators';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { AnswerI } from '@interfaces/answer.interface';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';
import { toggleAnswer } from '@modules/ticket/animations/toggle-answer.animation';
import { AttachmentService } from '@shared/services/attachment/attachment.service';
import { TicketPolicy } from '@shared/policies/ticket/ticket.policy';
import { showFlagRight } from '@modules/ticket/animations/show-flag-right.animation';

@Component({
  selector: 'app-question-page-content',
  templateUrl: './question-page-content.component.html',
  styleUrls: ['./question-page-content.component.scss'],
  animations: [toggleAnswer, showFlagRight]
})
export class QuestionPageContentComponent implements OnInit {
  @Input() data: Ticket;
  @Input() standaloneLink: boolean;
  @Input() showFlags: boolean;
  ratingStream = new Subject<Ticket>();
  linkAnimation = 'hide';

  constructor(
    private ticketService: TicketService,
    private attachmentService: AttachmentService,
    private policy: TicketPolicy
  ) { }

  ngOnInit() {
    this.ratingStream
      .pipe(
        first(),
        switchMap(() => this.ticketService.raiseRating(this.data))
      )
      .subscribe();

    if (this.showFlags === undefined) {
      this.showFlags = this.policy.authorize(this.data, 'showFlags');
    }
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
    attachment.loadingDownload = true;
    this.attachmentService.downloadAttachment(attachment)
      .pipe(finalize(() => attachment.loadingDownload = false))
      .subscribe(
        fileData => {
          if (fileData.type.match('^image|^application/pdf$')) {
            const url = window.URL.createObjectURL(fileData);

            window.open(url, '_blank');
          } else {
            const FileSaver = require('file-saver');

            FileSaver.saveAs(fileData, attachment.filename);
          }
        });
  }

  trackByAnswer(index, answer: AnswerI) {
    return answer.id;
  }

  trackByAttachment(index, attachment: AnswerAttachmentI) {
    return attachment.id;
  }
}
