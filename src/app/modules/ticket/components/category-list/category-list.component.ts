import { Component, OnInit, Input } from '@angular/core';

import { Category } from '@modules/ticket/models/category.model';
import { Service } from '@modules/ticket/models/service.model';
import { contentAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  animations: [contentAnimation]
})
export class CategoryListComponent implements OnInit {
  @Input() categories: Category[] = [];

  constructor() {}

  ngOnInit() {}

  trackByCategory(category: Category) {
    return category.id;
  }

  trackByService(service: Service) {
    return service.id;
  }
}
