import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CaseI } from '@interfaces/case.interface';
import { CaseService } from '@modules/case/services/case/case.service';

@Component({
  selector: 'app-cases-table',
  templateUrl: './cases-table.component.html',
  styleUrls: ['./cases-table.component.scss']
})
export class CasesTableComponent implements OnInit {
  @Input() cases: CaseI[] = [];
  @Input() loading = false;
  @Output() removeCase = new EventEmitter<any>();

  constructor(private caseService: CaseService) { }

  ngOnInit() {}

  /**
   * Отменить заявку
   *
   * @param kase - выбранная заявка.
   */
  destroyCase(kase: CaseI) {
    const confirmStr = 'Вы действительно хотите удалить заявку №' + kase.case_id + '?';

    if (!confirm(confirmStr)) {
      return false;
    }

    this.caseService.destroyCase(kase.case_id)
      .subscribe(
        () => this.removeCase.emit(true),
        err => console.log(err)
      );
  }
}
