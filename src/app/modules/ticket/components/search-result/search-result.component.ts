import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Category } from '@modules/ticket/models/category.model';
import { Service } from '@modules/ticket/models/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  result: (Category | Service | Ticket)[] = [];
  types = [
    {
      type: 'Все',
      klass: null
    },
    {
      type: 'Категории',
      klass: Category
    },
    {
      type: 'Услуги',
      klass: Service
    },
    {
      type: 'Вопросы/заявки',
      klass: Ticket
    }
  ];
  selectedType = this.types[0].klass;
  @Input() searchResult: Observable<(Category | Service | Ticket)[]>;
  private alive = true;

  constructor() {}

  ngOnInit() {
    this.searchResult
      .pipe(takeWhile(() => this.alive))
      .subscribe(result => this.result = result);
  }


  selectType(type: { type: string, klass: any }): void {
    this.selectedType = type.klass;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
