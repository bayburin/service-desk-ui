import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-question-page-content',
  templateUrl: './question-page-content.component.html',
  styleUrls: ['./question-page-content.component.scss']
})
export class QuestionPageContentComponent implements OnInit {
  @Input() data: Ticket;
  ratingStream = new Subject<Ticket>();

  constructor(private ticketService: TicketService) { }

  ngOnInit() {
    this.ratingStream
      .pipe(
        first(),
        switchMap((ticket) => this.ticketService.raiseRating(ticket))
      )
      .subscribe();
  }

  /**
   * "Раскрывает" вопрос и отправляет запрос на сервер с его id для изменения рейтинга.
   */
  toggleTicket(ticket: Ticket): void {
    ticket.open = !ticket.open;

    this.ratingStream.next(ticket);
  }
}
