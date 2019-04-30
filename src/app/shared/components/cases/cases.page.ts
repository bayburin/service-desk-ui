import { Component, OnInit, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { CaseService } from '@modules/case/services/case/case.service';
import { CaseI } from '@interfaces/case.interface';
import { StatusI } from '@interfaces/status.interface';
import { Service } from '@modules/ticket/models/service.model';

@Component({
  selector: 'app-cases-page',
  templateUrl: './cases.page.html',
  styleUrls: ['./cases.page.scss']
})
export class CasesPageComponent implements OnInit {
  loading = {
    initialization: false,
    table: false
  };
  cases: CaseI[] = [];
  statuses: StatusI[] = [];
  caseCount = 0;
  selectedStatus = null;
  @Input() services: Service[] = [];

  constructor(private caseService: CaseService) { }

  ngOnInit() {
    this.loadCases(true);
  }

  filterChanged(data) {
    this.selectedStatus = data;
    this.loadCases();
  }

  /**
   * Загружает список заявок.
   *
   * @param init - указывает, происходит ли запрос впервые (на этот момент мы не знаем, имеются у пользователь какие-либо заявки).
   */
  private loadCases(init = false): void {
    this.toggleLoading(init);

    this.caseService.getAllCases(this.getFilters())
      .pipe(finalize(() => {
        this.toggleLoading();
      }))
      .subscribe((data: { statuses: StatusI[], cases: CaseI[], case_count: number }) => {
        this.statuses = data.statuses;
        this.cases = data.cases;
        this.caseCount = data.case_count;
      });
  }

  /**
   * Возвращает список фильтров.
   */
  private getFilters() {
    const serviceIds = this.services.map(service => service.id);

    return {
      limit: 15,
      offset: 0,
      status_id: this.selectedStatus,
      service_ids: serviceIds
    };
  }

  /**
   * Переключить индиакторы загрузки
   */
  private toggleLoading(init = false) {
    this.loading.initialization = init ? !this.loading.initialization : false;
    this.loading.table = !this.loading.table;
  }
}
