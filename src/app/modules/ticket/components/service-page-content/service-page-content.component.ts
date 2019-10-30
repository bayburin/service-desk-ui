import { Component, OnInit, Input } from '@angular/core';

import { Service } from '@modules/ticket/models/service/service.model';

@Component({
  selector: 'app-service-page-content',
  templateUrl: './service-page-content.component.html',
  styleUrls: ['./service-page-content.component.scss']
})
export class ServicePageContentComponent implements OnInit {
  @Input() data: Service;
  @Input() showFlags: boolean;

  constructor() { }

  ngOnInit() {}

  generateLink(): string {
    return this.data.getShowLink();
  }
}
