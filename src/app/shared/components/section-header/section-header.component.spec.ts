import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeaderComponent } from './section-header.component';
import { By } from '@angular/platform-browser';

describe('SectionHeaderComponent', () => {
  let component: SectionHeaderComponent;
  let fixture: ComponentFixture<SectionHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SectionHeaderComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show header', () => {
    const myHeader = 'My custom header';
    component.header = myHeader;
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toContain(myHeader);
  });

  it('should add apply received class', () => {
    component.addClass = 'test';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('h2'));

    expect(el.nativeElement.getAttribute('class')).toContain('test');
  });
});
