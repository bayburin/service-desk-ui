import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading icon when "loading" attribute is true', () => {
    component.loading = true;
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('i[class*="mdi mdi-loading mdi-spin"]')).toBeTruthy();
  });

  it('should show loading icon with specified size', () => {
    component.loading = true;
    component.size = '48px';
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('i[class*="mdi mdi-loading mdi-spin mdi-48px"]')).toBeTruthy();
  });
});
