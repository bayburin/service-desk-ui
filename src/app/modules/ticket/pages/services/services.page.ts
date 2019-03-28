import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ServiceService } from '@shared/services/service/service.service';
import { ServiceI } from '@models/service.interface';

@Component({
  selector: 'app-services-page',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss']
})
export class ServicesPageComponent implements OnInit {
  public services: ServiceI[];

  constructor(private route: ActivatedRoute, private serviceService: ServiceService) {}

  ngOnInit() {
    // const categoryId = this.route.snapshot.params.id;

    // this.serviceService.loadServices(categoryId).subscribe((services: ServiceI[]) => this.services = services);
  }
}
