import { Component, OnInit, Input } from '@angular/core';

import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-claim-page-content',
  templateUrl: './claim-page-content.component.html',
  styleUrls: ['./claim-page-content.component.scss']
})
export class ClaimPageContentComponent implements OnInit {
  @Input() data: Ticket;

  constructor() { }

  ngOnInit() {}

  generateLink(): string {
    return this.data.getShowLink();
  }
}
