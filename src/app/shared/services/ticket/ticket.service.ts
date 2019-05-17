import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { environment } from 'environments/environment';
import { TicketI } from '@interfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  raiseRatingUri: string;

  constructor(private http: HttpClient) {}

  raiseRating(ticket: Ticket): Observable<TicketI> {
    this.raiseRatingUri = `${environment.serverUrl}/api/v1/services/${ticket.serviceId}/tickets/${ticket.id}`;

    return this.http.get<TicketI>(this.raiseRatingUri);
  }
}
