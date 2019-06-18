import { Component, OnInit } from '@angular/core';

import { routeAnimation } from '@animations/route.animation';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  animations: [routeAnimation]
})
export class CategoriesPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
