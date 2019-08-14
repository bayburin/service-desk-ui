import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SearchResultComponent } from './search-result.component';
import { FilterByClassPipe } from '@shared/pipes/filter-by-class/filter-by-class.pipe';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { Category } from '@modules/ticket/models/category.model';

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;
  const category = CategoryFactory.create({ id: 1, name: 'Тестовая категория' });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [SearchResultComponent, FilterByClassPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [FilterByClassPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;

  });

// Unit ====================================================================================================================================

  describe('with search result', () => {
    beforeEach(() => {
      component.searchResult = of([category]);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should save data in "result" variable', () => {
      expect(component.result).toEqual([category]);
    });

    it('should set count the number of data types', () => {
      const selectedType = component.types.find(type => type.name === 'Категории');

      expect(selectedType.count).toEqual(1);
    });
  });

  describe('#filterChanged', () => {
    it('should set new selectedType', () => {
      component.filterChanged(Category);

      expect(component.selectedType).toEqual(Category);
    });
  });

// Shallow tests ===========================================================================================================================

  describe('when search result is empty', () => {
    beforeEach(() => {
      component.searchResult = of([]);
      fixture.detectChanges();
    });

    it('should notification message', () => {
      expect(fixture.debugElement.nativeElement.querySelector('.search-title').textContent).toContain('Ничего не найдено.');
    });
  });

  describe('with search result', () => {
    beforeEach(() => {
      component.searchResult = of([category]);
      fixture.detectChanges();
    });

    it('should show app-section-header', () => {
      expect(fixture.debugElement.nativeElement.querySelector('app-section-header')).toBeTruthy();
    });

    it('should show app-filters component', () => {
      expect(fixture.debugElement.nativeElement.querySelector('app-filters')).toBeTruthy();
    });

    it('should show app-dynamic-template-content component', () => {
      expect(fixture.debugElement.nativeElement.querySelector('app-dynamic-template-content')).toBeTruthy();
    });
  });
});
