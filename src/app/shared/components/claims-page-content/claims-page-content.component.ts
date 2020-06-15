import { Component, OnInit, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { ClaimService } from '@modules/claim/services/claim/claim.service';
import { ClaimI } from '@interfaces/claim.interface';
import { FilterI } from '@interfaces/filter.interface';
import { Service } from '@modules/ticket/models/service/service.model';
import { contentBlockAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-claims-page-content',
  templateUrl: './claims-page-content.component.html',
  styleUrls: ['./claims-page-content.component.scss'],
  animations: [contentBlockAnimation]
})
export class ClaimsPageContentComponent implements OnInit {
  loading = {
    initialization: false,
    table: false
  };
  claims: ClaimI[] = [];
  statuses: FilterI[] = [];
  selectedStatusId: number;
  @Input() services: Service[] = [];

  constructor(private claimService: ClaimService) { }

  ngOnInit() {
    this.loadClaims(true);
  }

  /**
   * Событие изменения фильтра.
   *
   * @param id - id выбранного фильтра.
   */
  filterChanged(id: number) {
    this.selectedStatusId = id;
    this.loadClaims();
  }

  /**
   * Событие отмены заявки.
   */
  claimRevoked() {
    this.loadClaims();
  }

  /**
   * Проверяет, существуют ли какие-либо кейсы у текущего пользователя.
   */
  isAnyClaimsExists() {
    return this.statuses.some(status => status.count !== 0);
  }

  /**
   * Загружает список заявок.
   *
   * @param init - указывает, происходит ли запрос впервые (на этот момент мы не знаем, имеются у пользователь какие-либо заявки).
   */
  private loadClaims(init = false): void {
    this.toggleLoading(init);

    this.claimService.getAll(this.getFilters())
      .pipe(finalize(() => this.toggleLoading()))
      .subscribe((data: { statuses: FilterI[], apps: ClaimI[]}) => {
        this.statuses = data.statuses;
        this.claims = data.apps;
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
