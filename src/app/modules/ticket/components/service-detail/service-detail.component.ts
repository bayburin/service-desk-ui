import { Component, OnInit, Input } from '@angular/core';

import { Service } from '@modules/ticket/models/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  @Input() service: Service;

  constructor() {}

  ngOnInit() {}

  trackByTicket(ticket: Ticket) {
    return ticket.id;
  }
}
