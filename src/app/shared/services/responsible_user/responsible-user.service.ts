import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { Service } from '@modules/ticket/models/service/service.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleUserService {
  details: ResponsibleUserDetailsI[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Загружает информацию об ответственных.
   *
   * @param tns - список табельных номеров.
   */
  loadDetails(tns: number[]): Observable<ResponsibleUserDetailsI[]> {
    const loadDetailsUri = `${environment.serverUrl}/api/v1/responsible_users`;
    const httpParams = new HttpParams().append('tns', JSON.stringify(tns));

    return this.http.get<ResponsibleUserDetailsI[]>(loadDetailsUri, { params: httpParams })
      .pipe(tap(result => this.details = result));
  }

  /**
   * Производит поиск ответственных.
   *
   * @param type - поле, по которому производится поиск.
   * @param term - строка поиска.
   */
  searchUsers(type: string, term: string): Observable<ResponsibleUserDetailsI[]> {
    const loadUsersUri = `${environment.serverUrl}/api/v1/responsible_users/search`;
    const httpParams = new HttpParams().append('field', type).append('term', term);

    return this.http.get<ResponsibleUserDetailsI[]>(loadUsersUri, { params: httpParams });
  }

  /**
   * Для указанного объекта установить ассоциацию с объектами массива details.
   *
   * @param object - объект, у которого необходимо провести ассоциацию.
   */
  associateDetailsFor(object: Ticket | Service) {
    object.responsibleUsers.forEach(user => {
      user.details = this.details.find(userDetails => user.tn === userDetails.tn);
    });
  }
}
