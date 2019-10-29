import { Component, OnInit, Input } from '@angular/core';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-question-flags',
  templateUrl: './question-flags.component.html',
  styleUrls: ['./question-flags.component.sass']
})
export class QuestionFlagsComponent implements OnInit {
  @Input() question: Ticket;

  constructor() {}

  ngOnInit() {}
}
