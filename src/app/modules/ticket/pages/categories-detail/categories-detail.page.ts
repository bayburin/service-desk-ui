import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Category } from '@modules/ticket/models/category.model';
import { CategoryService } from '@shared/services/category/category.service';
import { Service } from '@modules/ticket/models/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-categories-detail-page',
  templateUrl: './categories-detail.page.html',
  styleUrls: ['./categories-detail.page.scss']
})
export class CategoriesDetailPageComponent implements OnInit {
  loading = false;
  category$: Observable<Category>;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const categoryId = this.route.snapshot.params.id;

    this.loading = true;
    this.category$ = this.categoryService.loadCategory(categoryId).pipe(finalize(() => this.loading = false));
  }

  trackByService(service: Service) {
    return service.id;
  }

  trackByTicket(ticket: Ticket) {
    return ticket.id;
  }
}
