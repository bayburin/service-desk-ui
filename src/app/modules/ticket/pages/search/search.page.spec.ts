import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { SearchPageComponent } from './search.page';
import { SearchService } from '@modules/ticket/services/search/search.service';
import { StubSearchService } from '@modules/ticket/services/search/search.service.stub';

describe('SearchComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let searchService: SearchService;
  const term = 'search_term';
  const search = { search: term };
  const stubRoute = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', ['snapshot', 'queryParams']);
  const stubRouteProxy = new Proxy(stubRoute, {
    get(target, prop) {
      if (prop === 'snapshot') {
        return { queryParams: search };
      } else if (prop === 'queryParams') {
        return of(search);
      }
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SearchPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SearchService, useClass: StubSearchService },
        { provide: ActivatedRoute, useValue: stubRouteProxy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    searchService = TestBed.get(SearchService);
    spyOn(searchService, 'deepSearch').and.returnValue(of('result'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "deepSearch" method for SearchService instance', () => {
    component.searchResult.subscribe(() => {
      expect(searchService.deepSearch).toHaveBeenCalledWith(term);
    });
  });

  it('should save search term in "searchTerm" attribute', () => {
    expect(component.searchTerm).toEqual(term);
  });

  it('should show app-global-search component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-global-search')).toBeTruthy();
  });

  it('should show app-search-result component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-search-result')).toBeTruthy();
  });
});
