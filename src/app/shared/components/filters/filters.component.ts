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
  selectedFilter = null;

  constructor() { }

  ngOnInit() {}

  /**
   * Событие выбора фильтра.
   *
   * @param FilterI - Id выбранного фильтра.
   */
  selectFilter(filterId: any) {
    this.selectedFilter = filterId;
    this.changeFilter.emit(this.selectedFilter);
  }
}
