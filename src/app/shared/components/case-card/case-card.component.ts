import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CaseI } from '@interfaces/case.interface';
import { CaseService } from '@modules/case/services/case/case.service';

@Component({
  selector: 'app-case-card',
  templateUrl: './case-card.component.html',
  styleUrls: ['./case-card.component.scss']
})
export class CaseCardComponent implements OnInit {
  @Input() kase: CaseI;
  @Output() removeCase = new EventEmitter<any>();

  constructor(private caseService: CaseService) { }

  ngOnInit() {}

  /**
   * Отменяет заявку.
   *
   * @param kase - выбранная заявка.
   */
  revokeCase() {
    if (this.kase.status_id !== 1) {
      alert('Отменить можно только заявку, имеющую статус "Не обработано". Если вы действительно хотите отменить текущую заявку, обратитесь по тел. 06.');
      return;
    }

    if (!confirm('Вы действительно хотите отменить заявку №' + this.kase.case_id + '?')) {
      return false;
    }

    this.caseService.revokeCase(this.kase.case_id)
      .subscribe(
        () => {
          this.removeCase.emit(true);
          alert('Заявка отменена');
        },
        err => console.log(err)
      );
  }

  /**
   * Возвращает true, если голосование разрешено.
   */
  isAllowedToVote(): boolean {
    return this.kase.status_id === 3 && !this.kase.rating;
  }

  /**
   * Установить оценку качеству обслужания по заявке.
   */
  vote(): void {
    this.caseService.voteCase(this.kase).subscribe();
  }
}
