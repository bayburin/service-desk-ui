import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

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

  constructor(private route: ActivatedRoute, private searchService: SearchService) { }

  ngOnInit() {
    this.searchTerm = this.route.snapshot.queryParams.search;
    this.searchResult = this.route.queryParams.pipe(
      mergeMap((params) => this.searchService.deepSearch(params.search))
    );
  }
}
