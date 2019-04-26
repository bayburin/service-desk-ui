import { Params } from '@angular/router';
import { Observable } from 'rxjs';

export interface BreadcrumbI {
  label: string | Observable<string>;
  params: Params;
  url: string;
}
