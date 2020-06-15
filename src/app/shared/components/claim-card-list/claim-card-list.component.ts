import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { ClaimI } from '@interfaces/claim.interface';
import { contentListAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-claim-card-list',
  templateUrl: './claim-card-list.component.html',
  styleUrls: ['./claim-card-list.component.scss'],
  animations: [contentListAnimation]
})
export class ClaimCardListComponent implements OnInit, OnChanges {
  @Input() cases: ClaimI[] = [];
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

  trackByCase(index, kase: ClaimI) {
    return kase.case_id;
  }
}
