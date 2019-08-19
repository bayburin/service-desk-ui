import { Component, OnInit, Input } from '@angular/core';

import { Category } from '@modules/ticket/models/category/category.model';

@Component({
  selector: 'app-category-header',
  templateUrl: './category-header.component.html',
  styleUrls: ['./category-header.component.scss']
})
export class CategoryHeaderComponent implements OnInit {
  @Input() category: Category;

  constructor() {}

  ngOnInit() {}
}
