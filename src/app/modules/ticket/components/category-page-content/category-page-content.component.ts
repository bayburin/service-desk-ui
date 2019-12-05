import { Component, OnInit, Input } from '@angular/core';

import { Category } from '@modules/ticket/models/category/category.model';

@Component({
  selector: 'app-category-page-content',
  templateUrl: './category-page-content.component.html',
  styleUrls: ['./category-page-content.component.scss']
})
export class CategoryPageContentComponent implements OnInit {
  @Input() data: Category;

  constructor() { }

  ngOnInit() {}

  generateLink(): string {
    return this.data.getShowLink();
  }
}
