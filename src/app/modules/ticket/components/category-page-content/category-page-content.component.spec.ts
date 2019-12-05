import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CategoryPageContentComponent } from './category-page-content.component';
import { Category } from '@modules/ticket/models/category/category.model';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';

describe('CategoryPageContentComponent', () => {
  let component: CategoryPageContentComponent;
  let fixture: ComponentFixture<CategoryPageContentComponent>;
  let category: Category;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CategoryPageContentComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPageContentComponent);
    component = fixture.componentInstance;
    category = CategoryFactory.create({ id: 1, name: 'Тестовая категория' });
    component.data = category;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "getShowLink" method for data', () => {
    spyOn(component.data, 'getShowLink');
    component.generateLink();

    expect(component.data.getShowLink).toHaveBeenCalled();
  });

  it('should show link to new case', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain(category.name);
    expect(fixture.debugElement.nativeElement.querySelector('a[href="/categories/1"]')).toBeTruthy();
  });
});
