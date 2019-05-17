import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizeContentComponent } from './unauthorize-content.component';

describe('UnauthorizeContentComponent', () => {
  let component: UnauthorizeContentComponent;
  let fixture: ComponentFixture<UnauthorizeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnauthorizeContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
