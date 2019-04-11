import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { CaseI } from '@models/case.interface';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private casesUrl = `${environment.serverUrl}/api/v1/cases`;

  constructor(private http: HttpClient) {}

  /**
   * Получить список кейсов.
   */
  getAllCases(): Observable<CaseI[]> {
    return this.http.get<CaseI[]>(this.casesUrl);
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
