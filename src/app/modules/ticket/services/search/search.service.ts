import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { ServiceTemplateCreator } from '@modules/ticket/core/service-template-creator/service-template-creator';
import { SearchSortingPipe } from '@shared/pipes/search-sorting/search-sorting.pipe';
import { ServiceTemplateI } from '@interfaces/service-template.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private http: HttpClient,
    private searchSortingPipe: SearchSortingPipe
  ) { }

  /**
   * Возвращает совместный список категорий/сервисов/вопросов/заявок.
   *
   * @params searchValue - поисковая строка.
   */
  search(searchValue: string): Observable<any> {
    const searchUri = `${environment.serverUrl}/api/v1/dashboard/search`;

    return this.searchRequest(searchUri, searchValue);
  }

  /**
   * Возвращает совместный список категорий/сервисов/вопросов/заявок со вложенными структурами данных.
   *
   * @params searchValue - поисковая строка.
   */
  deepSearch(searchValue: string): Observable<any> {
    const searchUri = `${environment.serverUrl}/api/v1/dashboard/deep_search`;

    return this.searchRequest(searchUri, searchValue);
  }

  private searchRequest(uri: string, searchValue: string): Observable<any> {
    const params = new HttpParams().set('search', searchValue);

    return this.http.get<any>(uri, { params }).pipe(
      map(data => {
        const arr = data.map((template: ServiceTemplateI) => ServiceTemplateCreator.createBy(template));

        return this.searchSortingPipe.transform(arr);
      })
    );
  }
}
