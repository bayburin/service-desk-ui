import { Component, Input } from '@angular/core';

import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { Answer } from '@modules/ticket/models/answer/answer.model';

@Component({
  selector: 'app-visible-flag',
  templateUrl: './visible-flag.component.html',
  styleUrls: ['./visible-flag.component.sass']
})
export class VisibleFlagComponent {
  @Input() data: Service | Ticket | Answer;

  constructor() { }
}
