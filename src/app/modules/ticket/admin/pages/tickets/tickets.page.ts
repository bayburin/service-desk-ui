import { Component, OnInit } from '@angular/core';

import { routeAnimation } from '@animations/route.animation';

@Component({
  selector: 'app-tickets-page',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.sass'],
  animations: [routeAnimation]
})
export class TicketsPageComponent implements OnInit {
  constructor() { }

  ngOnInit() {}
}
