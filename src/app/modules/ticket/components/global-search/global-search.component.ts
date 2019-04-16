import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, finalize, takeWhile, catchError } from 'rxjs/operators';

import { APP_CONFIG } from '@config/app.config';
import { AppConfigI } from '@models/app-config.interface';
import { DashboardService } from '@modules/ticket/services/dashboard/dashboard.service';
import { ServiceTemplateI } from '@models/service-template.interface';
import { TemplateService } from '@shared/services/template/template.service';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  private alive = true;
  public serviceCtrl: FormControl;
  public loading = false;
  @Input() searchTerm: string;

  constructor(
    @Inject(APP_CONFIG) private config: AppConfigI,
    private router: Router,
    private dashboardService: DashboardService,
    private templateService: TemplateService
  ) { }

  ngOnInit() {
    this.serviceCtrl = new FormControl({ name: this.searchTerm });
    this.serviceCtrl.valueChanges
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: string | ServiceTemplateI) => {
        if (typeof res === 'string') {
          this.searchTerm = res;
          return;
        }

        this.searchTerm = res.name;
        const url = this.templateService.generateUrlBy(res);
        this.router.navigateByUrl(url);
      });
  }

  search = (searchTerm: Observable<string>) => {
    return searchTerm.pipe(
      debounceTime(500),
      takeWhile(() => this.alive),
      switchMap(term => {
        if (!term || term.length < this.config.minLengthSearch) {
          return of([]);
        }

        this.loading = true;
        return this.dashboardService.search(term).pipe(finalize(() => this.loading = false));
      }),
      catchError(() => of([]))
    );
  }

  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.length < this.config.minLengthSearch) {
      return;
    }

    this.router.navigate(['search'], { queryParams: { search: this.searchTerm.trim() } });
  }

  formatter = (val: { name: string }) => val.name;

  ngOnDestroy() {
    this.alive = false;
  }
}
