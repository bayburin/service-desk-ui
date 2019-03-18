import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, finalize, takeWhile } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { SearchService } from '@modules/ticket/services/search/search.service';
import { ServiceTemplateI } from '@models/service_template.interface';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  public serviceCtrl: FormControl;
  public loading = false;
  private alive = true;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.serviceCtrl = new FormControl();
    this.serviceCtrl.valueChanges
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: string | ServiceTemplateI) => {
        if (typeof res === 'string') {
          return;
        }

        if (res.service_id) {
          // Навигация на страницу конкретного вопроса и ответа
        } else if (res.category_id) {
          // Навигация на страницу вопросов выбранного сервиса
        } else {
          // Навигация на страницу сервисов выбранной категории
        }
      });
  }

  search = (searchTerm: Observable<string>) => {
    return searchTerm.pipe(
      debounceTime(500),
      takeWhile(() => this.alive),
      switchMap(term => {
        if (term.length < 3) {
          return of([]);
        }

        this.loading = true;
        return this.searchService.search(term).pipe(finalize(() => this.loading = false));
      })
    );
  }

  formatter = (val: { name: string }) => val.name;

  ngOnDestroy() {
    this.alive = false;
  }
}
