import { mergeMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { of, Observable } from 'rxjs';

import { GlobalSearchComponent } from '@modules/ticket/components/global-search/global-search.component';
import { ServiceTemplateI } from '@models/service-template.interface';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPageComponent implements OnInit {
  @ViewChild(GlobalSearchComponent) private searchComponent: GlobalSearchComponent;
  public searchTerm: string;
  public searchResult: Observable<ServiceTemplateI[]>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.searchTerm = this.route.snapshot.queryParams.search;
    this.searchResult = this.route.queryParams.pipe(
      mergeMap((params) => this.searchComponent.search(of(params.search)))
    );
  }
}
