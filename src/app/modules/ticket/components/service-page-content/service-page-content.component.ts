import { Component, OnInit, Input } from '@angular/core';

import { Service } from '@modules/ticket/models/service/service.model';
import { ServicePolicy } from '@shared/policies/service/service.policy';

@Component({
  selector: 'app-service-page-content',
  templateUrl: './service-page-content.component.html',
  styleUrls: ['./service-page-content.component.scss']
})
export class ServicePageContentComponent implements OnInit {
  @Input() data: Service;
  @Input() showFlags: boolean;

  constructor(private policy: ServicePolicy) { }

  ngOnInit() {
    if (this.showFlags === undefined) {
      this.showFlags = this.policy.authorize(this.data, 'showFlags');
    }
  }

  generateLink(): string {
    return this.data.getShowLink();
  }
}
