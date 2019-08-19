import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CategoryListComponent } from './category-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Category } from '@modules/ticket/models/category/category.model';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  const services = [
    ServiceFactory.create({ id: 1, name: 'Услуга 1', categoryId: 1 }),
    ServiceFactory.create({ id: 2, name: 'Услуга 2', categoryId: 1 })
  ];
  const categories: Category[] = [
    CategoryFactory.create({ id: 3, name: 'Категория 1', services: services })
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [CategoryListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    component.categories = categories;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show app-category-header component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-category-header')).toBeTruthy();
  });

  it('should show all categories', () => {
    expect(fixture.debugElement.nativeElement.querySelectorAll('app-category-header').length).toEqual(1);
  });

  it('should show all services for each category', () => {
    services.map(service => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(service.name);
    });
  });
});
