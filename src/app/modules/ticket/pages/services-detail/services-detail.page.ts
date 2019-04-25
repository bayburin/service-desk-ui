import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ServiceService } from '@shared/services/service/service.service';
import { ServiceI } from '@models/service.interface';

@Component({
  selector: 'app-services-detail-page',
  templateUrl: './services-detail.page.html',
  styleUrls: ['./services-detail.page.scss']
})
export class ServicesDetailPageComponent implements OnInit {
  public loading = false;
  public service$: Observable<ServiceI>;

  constructor(private serviceService: ServiceService, private route: ActivatedRoute) { }

  ngOnInit() {
    const categoryId = this.route.parent.snapshot.params.id;
    const serviceId = this.route.snapshot.params.id;

    this.loading = true;
    this.service$ = this.serviceService.loadService(categoryId, serviceId).pipe(finalize(() => this.loading = false));
  }
}
