import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { CaseI } from '@models/case.interface';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private createCaseUrl = `${environment.serverUrl}/api/v1/cases`;

  constructor(private http: HttpClient) {}

  createCase(data: CaseI): Observable<any> {
    return this.http.post(this.createCaseUrl, { case: data });
  }
}
