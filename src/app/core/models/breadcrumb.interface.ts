import { Params } from '@angular/router';

export interface BreadcrumbI {
  label: string;
  params: Params;
  url: string;
}
