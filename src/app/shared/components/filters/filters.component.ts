import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FilterI } from '@interfaces/filter.interface';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Input() data: FilterI[] = [];
  @Output() changeFilter = new EventEmitter<any>();
  selectedFilterId: number;

  constructor() { }

  ngOnInit() {}

  /**
   * Событие выбора фильтра.
   *
   * @param FilterId - Id выбранного фильтра.
   */
  selectFilter(filterId: number) {
    this.selectedFilterId = filterId;
    this.changeFilter.emit(this.selectedFilterId);
  }

  trackByFilter(index, filter: FilterI) {
    return filter.id;
  }
}
