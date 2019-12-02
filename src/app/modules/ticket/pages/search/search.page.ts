import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { mergeMap, finalize, filter, tap, share, switchMap, takeWhile, map } from 'rxjs/operators';

import { ServiceTemplateI } from '@interfaces/service-template.interface';
import { SearchService } from '@modules/ticket/services/search/search.service';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { UserPolicy } from '@shared/policies/user/user.policy';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {
  searchTerm: string;
  searchResult: Observable<ServiceTemplateI[]>;
  loading = false;
  alive = true;
  data: any[];

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private responsibleUserService: ResponsibleUserService,
    private policy: UserPolicy
  ) { }

  ngOnInit() {
    this.searchTerm = this.route.snapshot.queryParams.search;
    const observable = this.route.queryParams.pipe(
      filter(params => params.search),
      mergeMap(params => {
        this.loading = true;
        return this.searchService.deepSearch(params.search).pipe(finalize(() => this.loading = false));
      }),
      tap(result => this.data = result),
      share()
    );
    this.searchResult = observable;

    observable.pipe(
      filter(() => this.policy.authorize(null, 'responsibleUserAccess')),
      takeWhile(() => this.alive),
      switchMap(result => this.responsibleUserService.loadDetails(this.getIds(result))),
      map(details => {
        this.data.forEach(el => {
          if (el.responsibleUsers) {
            el.associateResponsibleUserDetails(details);
          }
        });
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private getIds(data: any[]): number[] {
    return data.flatMap(template => {
      return template.responsibleUsers ? template.responsibleUsers.map((user: ResponsibleUserI) => user.tn) : [];
    });
  }
}
