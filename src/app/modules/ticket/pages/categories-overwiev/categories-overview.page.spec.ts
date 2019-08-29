import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CategoriesOverviewPageComponent } from './categories-overview.page';
import { CategoryService } from '@shared/services/category/category.service';
import { StubCategoryService } from '@shared/services/category/category.service.stub';

describe('CategoriesOverwievComponent', () => {
  let component: CategoriesOverviewPageComponent;
  let fixture: ComponentFixture<CategoriesOverviewPageComponent>;
  let categoryService: CategoryService;
  const categories = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesOverviewPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: CategoryService, useClass: StubCategoryService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesOverviewPageComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.get(CategoryService);
    spyOn(categoryService, 'loadCategories').and.returnValue(of(categories));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "loadCategories" method for CategoryService instance', () => {
    expect(categoryService.loadCategories).toHaveBeenCalled();
  });

  it('should set "categories" variable', () => {
    expect(component.categories).toEqual(categories);
  });

  it('should show app-section-header component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-section-header')).toBeTruthy();
  });

  it('should show app-category-list component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-category-list')).toBeTruthy();
  });
});
