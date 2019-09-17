import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { contentBlockAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.sass'],
  animations: [contentBlockAnimation]
})
export class ServiceDetailComponent implements OnInit {
  @Input() service: Service;

  constructor() { }

  ngOnInit() {}

  trackByTicket(index, ticket: Ticket) {
    return ticket.id;
  }
}
