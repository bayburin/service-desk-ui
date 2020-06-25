import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { TagI } from '@interfaces/tag.interface';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) { }

  /**
   * Загружает список тегов.
   *
   * @param term - поисковая строка
   */
  loadTags(term: string): Observable<TagI[]> {
    const tagUri = `${environment.serverUrl}/api/v1/tags`;
    const httpParams = new HttpParams().set('search', term);

    return this.http.get<TagI[]>(tagUri, { params: httpParams });
  }

  /**
   * Загружает популярные теги для услуги.
   *
   * @param serviceId - id услуги
   * @param limit - количество тегов
   */
  popular(serviceId: number, limit = 20): Observable<TagI[]> {
    const tagsUri = `${environment.serverUrl}/api/v1/tags/popular`;
    const httpParams = new HttpParams().set('service_id', `${serviceId}`).set('limit', `${limit}`);

    return this.http.get<TagI[]>(tagsUri, { params: httpParams });
  }
}
