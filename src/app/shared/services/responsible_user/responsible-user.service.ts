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
   * Загрузить информацию об ответственных
   */
  loadDetails(tns: number[]): Observable<ResponsibleUserDetailsI[]> {
    const loadDetailsUri = `${environment.serverUrl}/api/v1/responsible_users`;
    const httpParams = new HttpParams().append('tns', JSON.stringify(tns));

    return this.http.get<ResponsibleUserDetailsI[]>(loadDetailsUri, { params: httpParams })
      .pipe(tap(result => this.details = result));
  }

  /**
   * Для указанного объекта установить ассоциацию с массивом details.
   */
  associateDetailsFor(object: Ticket | Service) {
    object.responsibleUsers.forEach(user => {
      user.details = this.details.find(userDetails => user.tn === userDetails.tn);
    });
  }
}
