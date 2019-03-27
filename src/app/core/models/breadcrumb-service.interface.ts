import { Observable } from 'rxjs';

export interface BreadcrumbServiceI {
  getParentNodeName(): Observable<string>;
}
