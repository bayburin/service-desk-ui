import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CategoryHeaderComponent } from './category-header.component';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { Category } from '@modules/ticket/models/category.model';

describe('CategoryHeaderComponent', () => {
  let component: CategoryHeaderComponent;
  let fixture: ComponentFixture<CategoryHeaderComponent>;
  let category: Category;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CategoryHeaderComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryHeaderComponent);
    component = fixture.componentInstance;
    category = CategoryFactory.create({ id: 1, name: 'Тестовая категория' });
    component.category = category;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show link to category details', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain(category.name);
    expect(fixture.debugElement.nativeElement.querySelector('a[href="/categories/1"]')).toBeTruthy();
  });
});
