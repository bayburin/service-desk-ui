import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { StatusI } from '@interfaces/status.interface';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @Input() data: StatusI[] = [];
  @Input() totalCount = 0;
  @Output() changeFilter = new EventEmitter<any>();
  selectedFilter = null;

  constructor() { }

  ngOnInit() {}

  /**
   * Событие выбора фильтра.
   *
   * @param statusId - Id выбранного фильтра.
   */
  selectFilter(statusId: any) {
    this.selectedFilter = statusId;
    this.changeFilter.emit(this.selectedFilter);
  }
}
