import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { CaseI } from '@interfaces/case.interface';
import { FilterI } from '@interfaces/filter.interface';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private casesUri = `${environment.serverUrl}/api/v1/cases`;

  constructor(private http: HttpClient) {}

  /**
   * Получает список кейсов.
   */
  getAllCases(filters = {}): Observable<{ statuses: FilterI[], cases: CaseI[] }> {
    const params = new HttpParams().append('filters', JSON.stringify(filters));

    return this.http.get<{ statuses: FilterI[], cases: CaseI[] }>(this.casesUri, { params: params });
  }

  /**
   * Создает кейс.
   *
   * @param data - данные о кейсе.
   */
  createCase(data: CaseI): Observable<any> {
    return this.http.post(this.casesUri, { case: data });
  }

  /**
   * Отменяет заявку.
   */
  revokeCase(caseId: number): Observable<Object> {
    const caseUrl = `${this.casesUri}/${caseId}`;

    return this.http.delete(caseUrl);
  }

  /**
   * Возвращает объект case для отправки на сервер.
   */
  getRawValues(caseObj): CaseI {
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
  voteCase(data: CaseI): Observable<any> {
    const caseUrl = `${this.casesUri}/${data.case_id}`;

    return this.http.put(caseUrl, { case: data });
  }

  /**
   * Проверяет, закрыта ли указанная заявка.
   *
   * @param kase - заявка
   */
  isClosed(kase: CaseI): boolean {
    return kase.status_id === 3 || kase.status_id === 4;
  }
}
