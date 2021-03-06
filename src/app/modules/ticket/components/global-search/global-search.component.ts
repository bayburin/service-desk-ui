import { Component, OnInit, OnDestroy, Input, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, finalize, takeWhile, catchError, mergeMap } from 'rxjs/operators';

import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { APP_CONFIG } from '@config/app.config';
import { AppConfigI } from '@interfaces/app-config.interface';
import { SearchService } from '@modules/ticket/services/search/search.service';
import { Category } from '@modules/ticket/models/category/category.model';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  serviceCtrl: FormControl;
  loading = false;
  @Input() searchTerm: string;
  @ViewChild(NgbTypeahead, { static: true }) globalSearch: NgbTypeahead;
  private alive = true;
  private isGlobalSearch = false;

  constructor(
    @Inject(APP_CONFIG) private config: AppConfigI,
    private router: Router,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.serviceCtrl = new FormControl({ name: this.searchTerm });
    this.serviceCtrl.valueChanges
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: string | Category | Service | Ticket) => {
        if (typeof res === 'string') {
          this.searchTerm = res;
          return;
        }

        this.searchTerm = res.name;
        this.router.navigateByUrl(res.getShowLink());
      });
  }

  /**
   * Поиск, вызывающийся сразу после того, как пользователь ввел данные.
   *
   * @param searchTerm - строка поиска
   */
  search = (searchTerm: Observable<string>) => {
    return searchTerm.pipe(
      debounceTime(500),
      takeWhile(() => this.alive),
      mergeMap(term => {
        if (!term || term.length < this.config.minLengthSearch) {
          return of([]);
        }

        this.loading = true;
        return this.searchService.search(term)
          .pipe(
            finalize(() => {
              this.loading = false;

              if (this.isGlobalSearch) {
                this.globalSearch.dismissPopup();
                this.isGlobalSearch = false;
              }
            }),
            catchError(() => of([]))
          );
      }),
    );
  }

  /**
   * Событие поиска по нажатии на кнопку "Поиск".
   */
  onSearch(): void {
    this.isGlobalSearch = true;
    if (!this.searchTerm || this.searchTerm.length < this.config.minLengthSearch) {
      return;
    }
    this.router.navigate(['search'], { queryParams: { search: this.searchTerm.trim() } });
  }

  /**
   * Форматирует выводимые данные.
   */
  formatter = (val: { name: string }) => val.name;

  ngOnDestroy() {
    this.alive = false;
  }
}
