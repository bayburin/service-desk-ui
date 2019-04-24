import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { CaseI } from '@models/case.interface';
import { StatusI } from '@models/status.interface';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private casesUrl = `${environment.serverUrl}/api/v1/cases`;

  constructor(private http: HttpClient) {}

  /**
   * Получить список кейсов.
   */
  getAllCases(filters = {}): Observable<{ statuses: StatusI[], cases: CaseI[], case_count: number }> {
    const params = new HttpParams().append('filters', JSON.stringify(filters));

    return this.http.get<{ statuses: StatusI[], cases: CaseI[], case_count: number }>(this.casesUrl, { params: params });
  }

  /**
   * Создать кейс.
   *
   * @param data - данные о кейсе.
   */
  createCase(data: CaseI): Observable<any> {
    return this.http.post(this.casesUrl, { case: data });
  }
}
