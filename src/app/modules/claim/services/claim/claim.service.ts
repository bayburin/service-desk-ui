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
   * Получает список кейсов.
   */
  getAllCases(filters = {}): Observable<{ statuses: FilterI[], apps: ClaimI[] }> {
    const params = new HttpParams().append('filters', JSON.stringify(filters));

    return this.http.get<{ statuses: FilterI[], apps: ClaimI[] }>(this.claimsUri, { params });
  }

  /**
   * Создает кейс.
   *
   * @param data - данные о кейсе.
   */
  createCase(data: ClaimI): Observable<any> {
    return this.http.post(this.claimsUri, { case: data });
  }

  /**
   * Отменяет заявку.
   */
  revokeCase(caseId: number): Observable<Object> {
    const caseUrl = `${this.claimsUri}/${caseId}`;

    return this.http.delete(caseUrl);
  }

  /**
   * Возвращает объект case для отправки на сервер.
   */
  getRawValues(caseObj): ClaimI {
    if (!caseObj.without_service) {
      caseObj.service_id = caseObj.service.id;
    }
    if (!caseObj.without_item) {
      caseObj.item_id = caseObj.item.item_id;
      caseObj.invent_num = caseObj.item.invent_num;
    }

    delete caseObj.service;
    delete caseObj.item;

    return caseObj;
  }

  /**
   * Устанавливает качество обслуживания по заявке.
   *
   * @param data - данные заявки.
   */
  voteCase(data: ClaimI): Observable<any> {
    const caseUrl = `${this.claimsUri}/${data.case_id}`;

    return this.http.put(caseUrl, { case: data });
  }

  /**
   * Проверяет, закрыта ли указанная заявка.
   *
   * @param kase - заявка
   */
  isClosed(kase: ClaimI): boolean {
    return kase.status_id === 3 || kase.status_id === 4;
  }
}
