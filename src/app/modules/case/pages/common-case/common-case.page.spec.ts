import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCasePageComponent } from './common-case.page';

describe('CommonCasePageComponent', () => {
  let component: CommonCasePageComponent;
  let fixture: ComponentFixture<CommonCasePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonCasePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
