import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service.model';

@Component({
  selector: 'app-services-overwiev-page',
  templateUrl: './services-overwiev.page.html',
  styleUrls: ['./services-overwiev.page.scss']
})
export class ServicesOverwievPageComponent implements OnInit {
  loading = false;
  services: Observable<Service[]>;

  constructor(private serviceService: ServiceService) { }

  ngOnInit() {
    this.loading = true;
    this.services = this.serviceService.loadServices().pipe(finalize(() => this.loading = false));
  }

  trackByService(index, service: Service) {
    return service.id;
  }
}
