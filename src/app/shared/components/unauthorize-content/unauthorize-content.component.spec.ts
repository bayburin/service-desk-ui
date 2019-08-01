import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UnauthorizeContentComponent } from './unauthorize-content.component';

describe('UnauthorizeContentComponent', () => {
  let component: UnauthorizeContentComponent;
  let fixture: ComponentFixture<UnauthorizeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UnauthorizeContentComponent],
      schemas: [NO_ERRORS_SCHEMA]
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

  it('should show occured content', () => {

  });
});

@Component({
  template: '<app-unauthorize-content><span>testing</span></app-unauthorize-content>'
})
export class ContentProjectionTesterComponent {}

describe('ContentProjectionTesterComponent', () => {
  let component: ContentProjectionTesterComponent;
  let fixture: ComponentFixture<ContentProjectionTesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentProjectionTesterComponent, UnauthorizeContentComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentProjectionTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should works content projection', () => {
    const innerHtml = fixture.debugElement.nativeElement.innerHTML;

    expect(innerHtml).toContain('testing');
  });
});
