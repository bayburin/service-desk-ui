import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesOverwievPageComponent } from './services-overwiev.page';

describe('ServicesOverwievPageComponent', () => {
  let component: ServicesOverwievPageComponent;
  let fixture: ComponentFixture<ServicesOverwievPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesOverwievPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesOverwievPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
