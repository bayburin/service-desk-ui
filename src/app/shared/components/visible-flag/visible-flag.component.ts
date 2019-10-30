import { Component, Input } from '@angular/core';

import { AnswerI } from '@interfaces/answer.interface';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-visible-flag',
  templateUrl: './visible-flag.component.html',
  styleUrls: ['./visible-flag.component.sass']
})
export class VisibleFlagComponent {
  @Input() data: Service | Ticket | AnswerI;

  constructor() { }
}
