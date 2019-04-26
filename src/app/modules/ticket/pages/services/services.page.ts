import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service.model';

@Component({
  selector: 'app-services-page',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss']
})
export class ServicesPageComponent implements OnInit {
  public services: Service[];

  constructor(private route: ActivatedRoute, private serviceService: ServiceService) {}

  ngOnInit() {
    // const categoryId = this.route.snapshot.params.id;

    // this.serviceService.loadServices(categoryId).subscribe((services: Service[]) => this.services = services);
  }
}
