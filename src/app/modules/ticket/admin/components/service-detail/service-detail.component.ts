import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';

import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { contentBlockAnimation } from '@animations/content.animation';
import { QuestionComponent } from '../question/question.component';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.sass'],
  animations: [contentBlockAnimation]
})
export class ServiceDetailComponent implements OnInit {
  @Input() service: Service;
  @ViewChildren(QuestionComponent) questionTemplateComponent: QueryList<QuestionComponent>;

  constructor() { }

  ngOnInit() {}

  trackByTicket(index, ticket: Ticket) {
    return ticket.correction ? ticket.correction : ticket;
  }
}
