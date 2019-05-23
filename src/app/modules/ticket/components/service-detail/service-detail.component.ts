import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';

import { Service } from '@modules/ticket/models/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { DynamicTemplateContentComponent } from '@modules/ticket/components/dynamic-template-content/dynamic-template-content.component';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  @Input() service: Service;
  @ViewChildren(DynamicTemplateContentComponent) dynamicTemplateComponent: QueryList<DynamicTemplateContentComponent>;

  constructor() {}

  ngOnInit() {}

  trackByTicket(ticket: Ticket) {
    return ticket.id;
  }
}
