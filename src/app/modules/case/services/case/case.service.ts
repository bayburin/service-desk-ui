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
   * Получить список кейсов.
   */
  getAllCases(filters = {}): Observable<{ statuses: FilterI[], cases: CaseI[] }> {
    const params = new HttpParams().append('filters', JSON.stringify(filters));

    return this.http.get<{ statuses: FilterI[], cases: CaseI[] }>(this.casesUri, { params: params });
  }

  /**
   * Создать кейс.
   *
   * @param data - данные о кейсе.
   */
  createCase(data: CaseI): Observable<any> {
    return this.http.post(this.casesUri, { case: data });
  }

  /**
   * Отменить заявку.
   */
  destroyCase(caseId: number): Observable<Object> {
    const caseUrl = `${this.casesUri}/${caseId}`;

    return this.http.delete(caseUrl);
  }

  /**
   * Возвращает объект case для отправки на сервер.
   */
  getRowValues(caseObj): CaseI {
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
}
