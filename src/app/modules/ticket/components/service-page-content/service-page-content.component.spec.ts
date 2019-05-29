import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePageContentComponent } from './service-page-content.component';

describe('ServicePageContentComponent', () => {
  let component: ServicePageContentComponent;
  let fixture: ComponentFixture<ServicePageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicePageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
