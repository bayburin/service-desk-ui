import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { CaseService } from '@modules/case/services/case/case.service';
import { CaseI } from '@models/case.interface';
import { StatusI } from '@models/status.interface';

@Component({
  selector: 'app-cases-page',
  templateUrl: './cases.page.html',
  styleUrls: ['./cases.page.scss']
})
export class CasesPageComponent implements OnInit {
  public cases: CaseI[];
  public statuses: StatusI[];
  public selectedStatus = null;
  public loading = false;
  public caseCount = 1000;

  constructor(private caseService: CaseService) { }

  ngOnInit() {
    this.loadCases();
  }

  /**
   * Выбрать статус.
   *
   * @param statusId - Id выбранного статуса.
   */
  selectStatus(statusId): void {
    this.selectedStatus = statusId;
    this.loadCases();
  }

  /**
   * Загрузить список заявок.
   */
  private loadCases(): void {
    this.loading = true;
    this.caseService.getAllCases(this.getFilters())
      .pipe(finalize(() => this.loading = false))
      .subscribe((data: { statuses: StatusI[], cases: CaseI[] }) => {
        console.log(data);
        this.statuses = data.statuses;
        this.cases = data.cases;
      });
  }

  /**
   * Получить список фильтров
   */
  private getFilters() {
    return {
      limit: 15,
      offset: 0,
      status_id: this.selectedStatus
    };
  }
}
