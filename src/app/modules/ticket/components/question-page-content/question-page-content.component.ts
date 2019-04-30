import { Component, OnInit, Input } from '@angular/core';

import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-question-page-content',
  templateUrl: './question-page-content.component.html',
  styleUrls: ['./question-page-content.component.scss']
})
export class QuestionPageContentComponent implements OnInit {
  @Input() data: Ticket;

  constructor() { }

  ngOnInit() {}

  /**
   * "Раскрывает" вопрос.
   */
  toggleTicket(data: Ticket): void {
    data.open = !data.open;
  }
}
