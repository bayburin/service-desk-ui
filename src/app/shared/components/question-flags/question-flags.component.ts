import { Component, Input } from '@angular/core';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-question-flags',
  templateUrl: './question-flags.component.html',
  styleUrls: ['./question-flags.component.sass']
})
export class QuestionFlagsComponent {
  @Input() question: Ticket;

  constructor() {}
}
