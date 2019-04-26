import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { GlobalSearchComponent } from '@modules/ticket/components/global-search/global-search.component';
import { ServiceTemplateI } from '@interfaces/service-template.interface';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPageComponent implements OnInit {
  @ViewChild(GlobalSearchComponent) private searchComponent: GlobalSearchComponent;
  searchTerm: string;
  searchResult: Observable<ServiceTemplateI[]>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.searchTerm = this.route.snapshot.queryParams.search;
    this.searchResult = this.route.queryParams.pipe(
      mergeMap((params) => this.searchComponent.search(of(params.search)))
    );
  }
}
