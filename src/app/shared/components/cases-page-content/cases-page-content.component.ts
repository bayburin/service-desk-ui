import { Component, OnInit, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { CaseService } from '@modules/case/services/case/case.service';
import { CaseI } from '@interfaces/case.interface';
import { FilterI } from '@interfaces/filter.interface';
import { Service } from '@modules/ticket/models/service.model';
import { contentBlockAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-cases-page-content',
  templateUrl: './cases-page-content.component.html',
  styleUrls: ['./cases-page-content.component.scss'],
  animations: [contentBlockAnimation]
})
export class CasesPageContentComponent implements OnInit {
  loading = {
    initialization: false,
    table: false
  };
  cases: CaseI[] = [];
  statuses: FilterI[] = [];
  selectedStatusId: number;
  @Input() services: Service[] = [];

  constructor(private caseService: CaseService) { }

  ngOnInit() {
    this.loadCases(true);
  }

  /**
   * Событие изменения фильтра.
   *
   * @param id - id выбранного фильтра.
   */
  filterChanged(id: number) {
    this.selectedStatusId = id;
    this.loadCases();
  }

  /**
   * Событие отмены заявки.
   */
  caseRevoked() {
    this.loadCases();
  }

  /**
   * Проверяет, существуют ли какие-либо кейсы у текущего пользователя.
   */
  isAnyCasesExists() {
    return this.statuses.some(status => status.count !== 0);
  }

  /**
   * Загружает список заявок.
   *
   * @param init - указывает, происходит ли запрос впервые (на этот момент мы не знаем, имеются у пользователь какие-либо заявки).
   */
  private loadCases(init = false): void {
    this.toggleLoading(init);

    this.caseService.getAllCases(this.getFilters())
      .pipe(finalize(() => this.toggleLoading()))
      .subscribe((data: { statuses: FilterI[], cases: CaseI[]}) => {
        this.statuses = data.statuses;
        this.cases = data.cases;
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
      status_id: this.selectedStatusId,
      service_ids: serviceIds
    };
  }

  /**
   * Переключить индиакторы загрузки.
   */
  private toggleLoading(init = false) {
    this.loading.initialization = init ? !this.loading.initialization : false;
    this.loading.table = !this.loading.table;
  }
}
