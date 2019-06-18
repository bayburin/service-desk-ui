import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { CaseI } from '@interfaces/case.interface';
import { contentListAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-case-card-list',
  templateUrl: './case-card-list.component.html',
  styleUrls: ['./case-card-list.component.scss'],
  animations: [contentListAnimation]
})
export class CaseCardListComponent implements OnInit, OnChanges {
  @Input() cases: CaseI[] = [];
  @Input() loading = false;
  @Output() removeCase = new EventEmitter<any>();
  data = [];

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.data = [];
    for (let i = 0; i < this.cases.length; i += 2) {
      this.data.push(this.cases.slice(i, i + 2));
    }
  }

  /**
   * Событие отмены заявки.
   */
  revokeCase(): void {
    this.removeCase.emit(true);
  }

  trackByCase(kase: CaseI) {
    return kase.case_id;
  }
}
