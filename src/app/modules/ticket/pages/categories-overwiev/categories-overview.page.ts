import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CategoryService } from '@shared/services/category/category.service';
import { CategoryI } from '@models/category.interface';

@Component({
  selector: 'app-categories-overview-page',
  templateUrl: './categories-overview.page.html',
  styleUrls: ['./categories-overview.page.scss']
})
export class CategoriesOverviewPageComponent implements OnInit {
  public loading = false;
  categories: Observable<CategoryI[]>;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.loading = true;
    this.categories = this.categoryService.loadCategories().pipe(finalize(() => this.loading = false));
  }
}
