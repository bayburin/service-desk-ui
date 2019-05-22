import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { ServiceTemplateCreator } from '@modules/ticket/core/service_template_creator/service_template_creator';
import { SearchSortingPipe } from '@shared/pipes/search-sorting/search-sorting.pipe';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchUri = `${environment.serverUrl}/api/v1/dashboard/search`;

  constructor(
    private http: HttpClient,
    private searchSortingPipe: SearchSortingPipe
  ) { }

  /**
   * Возвращает совместный список категорий/сервисов/вопросов/заявок.
   */
  search(searchValue: string): Observable<any> {
    const params = new HttpParams().set('search', searchValue).set('without_associations', 'true');

    return this.http.get<any>(this.searchUri, { params: params }).pipe(
      map((data) => {
        const arr = data.map((template) => ServiceTemplateCreator.createBy(template));

        return this.searchSortingPipe.transform(arr);
      })
    );
  }
}
