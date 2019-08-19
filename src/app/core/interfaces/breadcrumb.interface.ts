import { Params } from '@angular/router';
import { Observable } from 'rxjs';

export interface BreadcrumbI {
  label: Observable<string>;
  params: Params;
  url: string;
}
