import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { BreadcrumbI } from '@models/breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: BreadcrumbI[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

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
    const routeParamName = 'breadcrumb';
    const childRoute = router.firstChild;

    if (childRoute) {
      if (!(childRoute.routeConfig.data && childRoute.routeConfig.data.hasOwnProperty(routeParamName))) {
        return this.buildBreadcrumbs(childRoute, url, breadcrumbs);
      }

      const path = `${url}${childRoute.routeConfig.path}/`;
      const breadcrumb = {
        label: childRoute.routeConfig.data[routeParamName],
        params: childRoute.snapshot.params,
        url: path
      };
      breadcrumbs.push(breadcrumb);

      return this.buildBreadcrumbs(childRoute, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
