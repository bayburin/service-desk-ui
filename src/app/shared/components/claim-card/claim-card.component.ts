import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ClaimI } from '@interfaces/claim.interface';
import { ClaimService } from '@modules/claim/services/claim/claim.service';

@Component({
  selector: 'app-claim-card',
  templateUrl: './claim-card.component.html',
  styleUrls: ['./claim-card.component.scss']
})
export class ClaimCardComponent implements OnInit {
  @Input() claim: ClaimI;
  @Output() removeClaim = new EventEmitter<any>();

  constructor(private claimService: ClaimService) { }

  ngOnInit() {}

  /**
   * Отменяет заявку.
   */
  revoke() {
    if (this.claim.status_id !== 1) {
      alert('Отменить можно только заявку, имеющую статус "Не обработано". Если вы действительно хотите отменить текущую заявку, обратитесь по тел. 06.');
      return;
    }

    if (!confirm('Вы действительно хотите отменить заявку №' + this.claim.case_id + '?')) {
      return false;
    }

    this.claimService.revoke(this.claim.case_id)
      .subscribe(
        () => {
          this.removeClaim.emit(true);
          alert('Заявка отменена');
        },
        err => console.log(err)
      );
  }

  /**
   * Возвращает true, если голосование разрешено.
   */
  isAllowedToVote(): boolean {
    return this.claim.status_id === 3 && !this.claim.rating;
  }

  /**
   * Установить оценку качеству обслужания по заявке.
   */
  vote(): void {
    this.claimService.vote(this.claim).subscribe();
  }

  /**
   * Проверякт, закрыта ли заявка.
   */
  isClosed(): boolean {
    return this.claimService.isClosed(this.claim);
  }
}
