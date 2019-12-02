import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { GlobalSearchComponent } from './global-search.component';
import { APP_CONFIG, AppConfig } from '@config/app.config';
import { SearchService } from '@modules/ticket/services/search/search.service';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { StubSearchService } from '@modules/ticket/services/search/search.service.stub';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  let searchService: SearchService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [GlobalSearchComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: APP_CONFIG, useValue: AppConfig },
        { provide: SearchService, useClass: StubSearchService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
    searchService = TestBed.get(SearchService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#search', () => {
    it('should return empty array if length of search term less 3', () => {
      component.search(of('as')).subscribe(result => {
        expect(result).toEqual([]);
      });
    });

    it('should call "search" method for SearchService and return result', () => {
      const category = CategoryFactory.create({ id: 1, name: 'Тестовая категория' });
      spyOn(searchService, 'search').and.returnValue(of([category]));

      component.search(of('search')).subscribe(result => {
        expect(result).toEqual([category]);
      });
      expect(searchService.search).toHaveBeenCalledWith('search');
    });
  });

  describe('#onSearch', () => {
    it('should not search and redirect if search term less 3', inject([Router], (router: Router) => {
      component.searchTerm = '';
      spyOn(router, 'navigate');
      component.onSearch();

      expect(router.navigate).not.toHaveBeenCalled();
    }));

    it('should redirect to search page', inject([Router], (router: Router) => {
      component.searchTerm = 'search term';
      spyOn(router, 'navigate');
      component.onSearch();

      expect(router.navigate).toHaveBeenCalledWith(['search'], { queryParams: { search: component.searchTerm.trim() } });
    }));
  });
});
