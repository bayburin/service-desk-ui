import { Component, OnInit, Input, ViewChildren, QueryList, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { DynamicTemplateContentComponent } from '@modules/ticket/components/dynamic-template-content/dynamic-template-content.component';
import { contentBlockAnimation } from '@animations/content.animation';
import { ServicePolicy } from '@shared/policies/service/service.policy';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
  animations: [contentBlockAnimation]
})
export class ServiceDetailComponent implements OnInit, OnChanges {
  @Input() service: Service;
  @ViewChildren(DynamicTemplateContentComponent) dynamicTemplateComponent: QueryList<DynamicTemplateContentComponent>;
  showTicketFlags: boolean;

  constructor(private policy: ServicePolicy) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const service: SimpleChange = changes.service;

    if (service.currentValue && !service.previousValue) {
      this.showTicketFlags = this.policy.authorize(this.service, 'showFlags');
    }
  }

  trackByTicket(index, ticket: Ticket) {
    return ticket.id;
  }
}
