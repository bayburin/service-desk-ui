import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { Service } from '@modules/ticket/models/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { QuestionPageContentComponent } from '@modules/ticket/components/question-page-content/question-page-content.component';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  @Input() service: Service;
  @ViewChild(QuestionPageContentComponent) questionComponent: QuestionPageContentComponent;

  constructor() {}

  ngOnInit() {}

  trackByTicket(ticket: Ticket) {
    return ticket.id;
  }
}
