import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, finalize, filter } from 'rxjs/operators';

import { ServiceTemplateI } from '@interfaces/service-template.interface';
import { SearchService } from '@modules/ticket/services/search/search.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPageComponent implements OnInit {
  searchTerm: string;
  searchResult: Observable<ServiceTemplateI[]>;
  loading = false;

  constructor(private route: ActivatedRoute, private searchService: SearchService) { }

  ngOnInit() {
    this.searchTerm = this.route.snapshot.queryParams.search;
    this.searchResult = this.route.queryParams.pipe(
      filter(params => params.search),
      mergeMap(params => {
        this.loading = true;
        return this.searchService.deepSearch(params.search).pipe(finalize(() => this.loading = false));
      })
    );
  }
}
