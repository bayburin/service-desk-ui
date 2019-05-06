import { Component, OnInit, Input } from '@angular/core';

import { Category } from '@modules/ticket/models/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  @Input() categories: Category;

  constructor() {}

  ngOnInit() {}
}
