import { Component, OnInit, Input } from '@angular/core';

import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-claim-form-page-content',
  templateUrl: './claim-form-page-content.component.html',
  styleUrls: ['./claim-form-page-content.component.scss']
})
export class ClaimFormPageContentComponent implements OnInit {
  @Input() data: Ticket;

  constructor() { }

  ngOnInit() {}

  generateLink(): string {
    return this.data.getShowLink();
  }
}
