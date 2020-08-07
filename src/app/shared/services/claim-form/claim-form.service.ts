import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { ClaimFormI } from '@interfaces/claim-form.interface';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimFormService {
  constructor(private http: HttpClient) { }

  /**
   * Создает форму.
   *
   * @param claimFormI - объект QuestionI
   */
  create(claimFormI: ClaimFormI): Observable<any> {
    const formUri = this.apiBaseUri(claimFormI.ticket.service_id);

    return this.http.post(formUri, { app_template: claimFormI })
      .pipe(map((form: any) => TicketFactory.create(TicketTypes.CLAIM_FORM, form)));
  }

  private apiBaseUri(serviceId: number) {
    return `${environment.serverUrl}/api/v1/services/${serviceId}/app_templates`;
  }
}
