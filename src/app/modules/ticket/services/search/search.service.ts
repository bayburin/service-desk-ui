import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { ServiceTemplateCreator } from '@modules/ticket/core/service_template_creator/service_template_creator';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchUrl = `${environment.serverUrl}/api/v1/dashboard/search`;

  constructor(private http: HttpClient) { }

  /**
   * Возвращает совместный список категорий/сервисов/вопросов/заявок.
   */
  search(searchValue: string): Observable<any> {
    const params = new HttpParams().set('search', searchValue).set('without_associations', 'true');

    return this.http.get<any>(this.searchUrl, { params: params }).pipe(
      map((data) => data.map((template) => ServiceTemplateCreator.createBy(template)))
    );
  }
}
