import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, Subject } from 'rxjs';
import { map, filter, first, switchMap } from 'rxjs/operators';

import { BreadcrumbServiceI } from '@models/breadcrumb-service.interface';
import { TicketI } from '@models/ticket.interface';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService implements BreadcrumbServiceI {
  private loadTicketsUrl: string;
  private tickets = new Subject<TicketI[]>();

  constructor(private http: HttpClient) {}

  loadTickets(categoryId: number, id: number): Observable<TicketI[]> {
    this.loadTicketsUrl = `${environment.serverUrl}/api/v1/categories/${categoryId}/services/${id}`;

    return this.http.get<TicketI[]>(this.loadTicketsUrl).pipe(map((tickets: TicketI[]) => {
      this.tickets.next(tickets);

      return tickets;
    }));
  }

  getParentNodeName(): Observable<string> {
    return this.tickets.asObservable().pipe(
      filter((arr) => arr.length !== 0),
      switchMap((arr) => {
        return from(arr).pipe(
          first(),
          map((ticket: TicketI) => ticket.service.name)
        );
      })
    );
  }
}
