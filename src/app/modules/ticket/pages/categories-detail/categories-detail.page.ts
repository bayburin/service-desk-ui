import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Category } from '@modules/ticket/models/category/category.model';
import { CategoryService } from '@shared/services/category/category.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { contentBlockAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-categories-detail-page',
  templateUrl: './categories-detail.page.html',
  styleUrls: ['./categories-detail.page.scss'],
  animations: [contentBlockAnimation]
})
export class CategoriesDetailPageComponent implements OnInit, OnDestroy {
  loading = false;
  category$: BehaviorSubject<Category>;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.category$ = this.categoryService.category$;
    const categoryId = this.route.snapshot.params.id;

    this.loading = true;
    this.categoryService.loadCategory(categoryId)
      .pipe(finalize(() => this.loading = false))
      .subscribe();
  }

  ngOnDestroy() {
    this.category$.next(null);
  }

  trackByService(index, service: Service) {
    return service.id;
  }

  trackByTicket(index, ticket: Ticket) {
    return ticket.id;
  }
}
