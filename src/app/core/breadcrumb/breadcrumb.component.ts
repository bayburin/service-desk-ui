import { Component, OnInit, Injector } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { of, Observable, race } from 'rxjs';

import { BreadcrumbServiceI } from '@models/breadcrumb-service.interface';
import { BreadcrumbI } from '@models/breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: BreadcrumbI[] = [];
  private readonly routeParamName = 'breadcrumb';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private injector: Injector) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
      });
  }

  private buildBreadcrumbs(
    router: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadcrumbI[] = []
  ): BreadcrumbI[] {
    const childRoute = router.firstChild;

    if (childRoute) {
      const path = `${url}${childRoute.snapshot.url.map(segment => segment.path).join('/')}/`;

      if (!(childRoute.routeConfig.data && childRoute.routeConfig.data.hasOwnProperty(this.routeParamName))) {
        return this.buildBreadcrumbs(childRoute, path, breadcrumbs);
      }

      const labelName = this.getLabel(childRoute);
      const breadcrumb = {
        label: labelName,
        params: childRoute.snapshot.queryParams,
        url: path
      };
      breadcrumbs.push(breadcrumb);

      return this.buildBreadcrumbs(childRoute, path, breadcrumbs);
    }

    return breadcrumbs;
  }

  private getLabel(childRoute: ActivatedRoute): Observable<string> {
    const breadcrumb = childRoute.routeConfig.data[this.routeParamName];

    if (typeof breadcrumb === 'string') {
      return of(breadcrumb);
    } else if (Array.isArray(breadcrumb)) {
      return race(
        this.getBreadcrumbFromService(breadcrumb[0]),
        this.getBreadcrumbFromService(breadcrumb[1], true)
      );
    } else {
      return this.getBreadcrumbFromService(breadcrumb);
    }
  }

  private getBreadcrumbFromService(serviceType, flag?: boolean): Observable<string> {
    const service = this.injector.get<BreadcrumbServiceI>(serviceType);
    return service.getParentNodeName(flag);
  }
}
