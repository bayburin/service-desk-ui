import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesOverviewPageComponent } from './categories-overview.page';

describe('CategoriesOverwievComponent', () => {
  let component: CategoriesOverviewPageComponent;
  let fixture: ComponentFixture<CategoriesOverviewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesOverviewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
