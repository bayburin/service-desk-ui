import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) { }

  search(searchValue: string): Observable<any> {
    const params = new HttpParams().set('search', searchValue).set('without_associations', 'true');

    return this.http.get('https://dc-dev.iss-reshetnev.ru/api/v1/search', { params: params })
      .pipe(map(service => {
        console.log(service);
        return service;
      }));
  }
}
