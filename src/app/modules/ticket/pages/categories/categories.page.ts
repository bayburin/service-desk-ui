import { Component, OnInit } from '@angular/core';

import { CategoryService } from '@shared/services/category/category.service';
import { CategoryI } from '@models/category.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss']
})
export class CategoriesPageComponent implements OnInit {
  categories: Observable<CategoryI[]>;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categories = this.categoryService.loadAll();
  }
}
