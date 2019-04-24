import { Component, OnInit, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { CaseService } from '@modules/case/services/case/case.service';
import { CaseI } from '@models/case.interface';
import { StatusI } from '@models/status.interface';
import { ServiceI } from '@models/service.interface';

@Component({
  selector: 'app-cases-table',
  templateUrl: './cases-table.component.html',
  styleUrls: ['./cases-table.component.scss']
})
export class CasesTableComponent implements OnInit {
  public cases: CaseI[];
  public statuses: StatusI[];
  public selectedStatus = null;
  public loading = false;
  public caseCount = 1000;
  @Input() public services: ServiceI[] = [];

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
      .subscribe((data: { statuses: StatusI[], cases: CaseI[], case_count: number }) => {
        console.log(data);
        this.statuses = data.statuses;
        this.cases = data.cases;
        this.caseCount = data.case_count;
      });
  }

  /**
   * Получить список фильтров
   */
  private getFilters() {
    const serviceIds = this.services.map((service: ServiceI) => service.id);

    return {
      limit: 15,
      offset: 0,
      status_id: this.selectedStatus,
      service_ids: serviceIds
    };
  }
}
