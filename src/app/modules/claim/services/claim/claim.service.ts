import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { ClaimI } from '@interfaces/claim.interface';
import { FilterI } from '@interfaces/filter.interface';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private claimsUri = `${environment.serverUrl}/api/v1/apps`;

  constructor(private http: HttpClient) {}

  /**
   * Получает список заявок.
   */
  getAll(filters = {}): Observable<{ statuses: FilterI[], apps: ClaimI[] }> {
    const params = new HttpParams().append('filters', JSON.stringify(filters));

    return this.http.get<{ statuses: FilterI[], apps: ClaimI[] }>(this.claimsUri, { params });
  }

  /**
   * Создает заявку.
   *
   * @param data - данные о заявке.
   */
  create(data: ClaimI): Observable<any> {
    return this.http.post(this.claimsUri, { app: data });
  }

  /**
   * Отменяет заявку.
   *
   * @param id - номер заявки
   */
  revoke(id: number): Observable<Object> {
    const uri = `${this.claimsUri}/${id}`;

    return this.http.delete(uri);
  }

  /**
   * Возвращает объект заявки для отправки на сервер.
   */
  getRawValues(claimObj: any): ClaimI {
    if (!claimObj.without_service) {
      claimObj.service_id = claimObj.service.id;
    }
    if (!claimObj.without_item) {
      claimObj.item_id = claimObj.item.item_id;
      claimObj.invent_num = claimObj.item.invent_num;
    }

    delete claimObj.service;
    delete claimObj.item;

    return claimObj;
  }

  /**
   * Устанавливает качество обслуживания по заявке.
   *
   * @param data - данные заявки.
   */
  vote(data: ClaimI): Observable<any> {
    const uri = `${this.claimsUri}/${data.case_id}`;

    return this.http.put(uri, { app: data });
  }

  /**
   * Проверяет, закрыта ли указанная заявка.
   *
   * @param claim - заявка
   */
  isClosed(claim: ClaimI): boolean {
    return claim.status_id === 3 || claim.status_id === 4;
  }
}
