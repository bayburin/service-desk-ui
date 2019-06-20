import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';

import { Category } from '@modules/ticket/models/category.model';
import { Service } from '@modules/ticket/models/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { SearchResultFilterPipe } from '@shared/pipes/search-result-filter/search-result-filter.pipe';
import { contentBlockAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  animations: [contentBlockAnimation]
})
export class SearchResultComponent implements OnInit, OnDestroy {
  result: (Category | Service | Ticket)[] = [];
  searched = false;
  types = [
    {
      name: 'Все',
      id: null,
      count: 0
    },
    {
      name: 'Категории',
      id: Category,
      count: 0
    },
    {
      name: 'Услуги',
      id: Service,
      count: 0
    },
    {
      name: 'Вопросы/заявки',
      id: Ticket,
      count: 0
    }
  ];
  selectedType = this.types[0].id;
  @Input() searchResult: Observable<(Category | Service | Ticket)[]>;
  private alive = true;

  constructor(private searchResultFilterPipe: SearchResultFilterPipe) {}

  ngOnInit() {
    this.searchResult
      .pipe(
        takeWhile(() => this.alive),
        tap((arr) => {
          this.searched = true;
          this.types.map((type) => {
            type.count = this.searchResultFilterPipe.transform(arr, type.id).length;

            return type;
          });
        })
      )
      .subscribe(result => this.result = result);
  }

  /**
   * Событие изменения фильтра.
   */
  filterChanged(data) {
    this.selectedType = data;
  }

  ngOnDestroy() {
    this.alive = false;
  }

  isNotFound() {
    return !this.result.length && this.searched;
  }
}
