import { Component, OnInit, Injector } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { of, Observable, combineLatest } from 'rxjs';
import { filter, first, concatAll, startWith } from 'rxjs/operators';

import { BreadcrumbServiceI } from '@interfaces/breadcrumb-service.interface';
import { BreadcrumbI } from '@interfaces/breadcrumb.interface';
import { breadcrumbAnimation } from '@animations/breadcrumb.animation';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  animations: [breadcrumbAnimation]
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: BreadcrumbI[] = [];
  private readonly routeParamName = 'breadcrumb';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private injector: Injector) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
        this.updateBreadcrumb(breadcrumbs);
      });
  }

  trackByBreadcrumb(index: number, breadcrumb: BreadcrumbI) {
    return breadcrumb.url;
  }

  /**
   * Возвращает массив, на основании которого строится breadcrumb компонент.
   */
  private buildBreadcrumbs(
    router: ActivatedRoute,
    url: string = '',
    breadcrumbs: BreadcrumbI[] = []
  ): BreadcrumbI[] {
    const childRoute = router.firstChild;

    if (!childRoute) {
      return breadcrumbs;
    }

    const path = `${url}${childRoute.snapshot.url.map(segment => segment.path).join('/')}/`;

    if (!this.isBreadcrumbDefined(childRoute)) {
      return this.buildBreadcrumbs(childRoute, path, breadcrumbs);
    }

    const breadcrumb = {
      label: this.getLabel(childRoute),
      params: childRoute.snapshot.queryParams,
      url: path
    };

    breadcrumbs.push(breadcrumb);

    return this.buildBreadcrumbs(childRoute, path, breadcrumbs);
  }

  /**
   * Проверяет, определен ли в текущем маршруте параметр data с ключем breadcrumb.
   *
   * @param route - текущий маршрут.
   */
  private isBreadcrumbDefined(route: ActivatedRoute): boolean {
    return route.routeConfig.data && route.routeConfig.data.hasOwnProperty(this.routeParamName);
  }

  /**
   * Возвращает Observable со значением строки, которая должна быть вставлена в качестве label в компонент.
   *
   * @param route - текущий маршрут.
   */
  private getLabel(route: ActivatedRoute): Observable<string> {
    const breadcrumb = route.routeConfig.data[this.routeParamName];

    if (typeof breadcrumb === 'string') {
      return of(breadcrumb);
    } else if (Array.isArray(breadcrumb)) {
      return this.getBreadcrumbFromArray(breadcrumb);
    } else {
      return this.getBreadcrumbFromService(breadcrumb);
    }
  }

  /**
   * Обрабатывает массив сервисов и возвращает label из того сервиса, который первым его вернет не пустым.
   *
   * @param breadcrumbs - список сервисов.
   */
  private getBreadcrumbFromArray(breadcrumbs: BreadcrumbServiceI[]) {
    return combineLatest(
      this.getBreadcrumbFromService(breadcrumbs[0]).pipe(startWith('')),
      this.getBreadcrumbFromService(breadcrumbs[1], true).pipe(startWith(''))
    )
    .pipe(
      concatAll(),
      filter(Boolean),
      first()
    );
  }

  /**
   * Инжектирует указанный serviceType и вызывает у него метод для получения строки label.
   *
   * @param injectionService - инжектируемый сервис
   * @param parentNodeflag - флаг, определяющий, какой вызывать метод: который возвращает label текущего элемента, либо который
   * возвращает label родительского элемента.
   */
  private getBreadcrumbFromService(injectionService, parentNodeflag?: boolean): Observable<string> {
    const service = this.injector.get<BreadcrumbServiceI>(injectionService);

    return parentNodeflag ? service.getParentNodeName() : service.getNodeName();
  }

  /**
   * Обновить данные в старом массиве Breadcrumb
   *
   * @params newBreadcrumb - новый массив Breadcrumb
   */
  private updateBreadcrumb(newBreadcrumb: BreadcrumbI[]) {
    const diff = newBreadcrumb.length - this.breadcrumbs.length;

    // Обрезать старый ммасив, если это необходимо
    if (newBreadcrumb.length < this.breadcrumbs.length) {
      this.breadcrumbs = this.breadcrumbs.splice(diff, this.breadcrumbs.length);
    }

    newBreadcrumb.map((breadcrumb, index: number) => {
      if (this.breadcrumbs[index] && breadcrumb.url === this.breadcrumbs[index].url) {
        return;
      }

      this.breadcrumbs[index] = breadcrumb;
    });
  }
}
