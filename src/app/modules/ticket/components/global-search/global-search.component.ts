import { Component, OnInit, OnDestroy, Input, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, finalize, takeWhile, catchError, mergeMap, tap } from 'rxjs/operators';

import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { APP_CONFIG } from '@config/app.config';
import { AppConfigI } from '@interfaces/app-config.interface';
import { SearchService } from '@modules/ticket/services/search/search.service';
import { Category } from '@modules/ticket/models/category.model';
import { Service } from '@modules/ticket/models/service.model';
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
  /**
   * Если true - выпадающее меню с результатами поиска не будет раскрыто.
   */
  private closeState = false;

  constructor(
    @Inject(APP_CONFIG) private config: AppConfigI,
    private router: Router,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.serviceCtrl = new FormControl({ name: this.searchTerm });
    this.serviceCtrl.valueChanges
      .pipe(
        takeWhile(() => this.alive),
        tap(() => this.setOpenState())
      )
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
        if (!term || term.length < this.config.minLengthSearch || this.closeState) {
          return of([]);
        }

        this.loading = true;
        return this.searchService.search(term)
          .pipe(
            finalize(() => this.loading = false),
            catchError(error => {
              console.log('При поиске произошла ошибка: ', error);

              return of([]);
            })
          );
      }),
    );
  }

  /**
   * Событие поиска по нажатии на кнопку "Поиск".
   */
  onSearch(): void {
    this.setCloseState();
    this.globalSearch.dismissPopup();

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

  private setCloseState() {
    this.closeState = true;
  }

  private setOpenState() {
    this.closeState = false;
  }
}
