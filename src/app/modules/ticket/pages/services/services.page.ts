import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CategoryService } from '@shared/services/category/category.service';
import { ServiceService } from '@shared/services/service/service.service';
import { ServiceI } from '@models/service.interface';

@Component({
  selector: 'app-services-page',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss']
})
export class ServicesPageComponent implements OnInit {
  public services: ServiceI[];
  public categoryId: number;

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryId = this.route.snapshot.params.id;
    this.getServices();
  }

  private getServices() {
    const categories = this.categoryService.getCategories();

    if (categories) {
      this.services = categories.find((category) => category.id == this.categoryId).services;
    } else {
      this.serviceService.loadServices(this.categoryId).subscribe((services: ServiceI[]) => this.services = services);
    }
  }
}
