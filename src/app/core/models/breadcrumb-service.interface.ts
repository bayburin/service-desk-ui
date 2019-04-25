import { Observable } from 'rxjs';

export interface BreadcrumbServiceI {
  getNodeName(): Observable<string>;
  getParentNodeName(): Observable<string>;
}
