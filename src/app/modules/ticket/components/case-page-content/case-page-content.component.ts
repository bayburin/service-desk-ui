import { Component, OnInit, Input } from '@angular/core';

import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-case-page-content',
  templateUrl: './case-page-content.component.html',
  styleUrls: ['./case-page-content.component.scss']
})
export class CasePageContentComponent implements OnInit {
  @Input() data: Ticket;

  constructor() { }

  ngOnInit() {}

  generateLink(): string {
    return this.data.getShowLink();
  }
}
