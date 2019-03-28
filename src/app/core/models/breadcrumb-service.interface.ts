import { Observable } from 'rxjs';

export interface BreadcrumbServiceI {
  getParentNodeName(highLevel?: boolean): Observable<string>;
}
