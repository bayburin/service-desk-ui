import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { ServiceDetailComponent } from './service-detail.component';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';

@Pipe({ name: 'showOnlyMyTickets' })
class MockPipe implements PipeTransform {
  transform(arr: any[], ...attrs): any[] {
    return arr;
  }
}

describe('ServiceDetailComponent', () => {
  let component: ServiceDetailComponent;
  let fixture: ComponentFixture<ServiceDetailComponent>;
  let service: Service;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule],
      declarations: [ServiceDetailComponent, MockPipe],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDetailComponent);
    component = fixture.componentInstance;
    service = ServiceFactory.create({
      id: 1,
      name: 'Тестовая услуга',
      questions: [
        { id: 2, ticket: { name: 'Вопрос 1' } },
        { id: 3, ticket: { name: 'Вопрос 2' } }
      ]
    });
    component.service = service;
    localStorage.setItem('showOnlyMyQuestions', 'true');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load showOnlyMyQuestions from localStorage', () => {
    expect(component.showOnlyMyQuestions).toEqual(true);
  });

  it('should show app-section-header component', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('app-section-header');
  });

  it('should show app-question components', () => {
    expect(fixture.debugElement.nativeElement.querySelectorAll('app-question').length).toEqual(service.questions.length);
  });

  it('should show link to user mode', () => {
    expect(fixture.debugElement.nativeElement.querySelector('#userMode')).toBeTruthy();
  });

  it('should show app-responsible-user-details component', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-responsible-user-details'))).toBeTruthy();
  });

  describe('#toggleshowOnlyMyQuestions', () => {
    it('should set into showOnlyMyQuestions attribute true value if it was false', () => {
      component.showOnlyMyQuestions = false;
      component.toggleshowOnlyMyQuestions();

      expect(component.showOnlyMyQuestions).toBeTruthy();
    });

    it('should set into showOnlyMyQuestions attribute false value if it was true', () => {
      component.showOnlyMyQuestions = true;
      component.toggleshowOnlyMyQuestions();

      expect(component.showOnlyMyQuestions).toBeFalsy();
    });

    it('should save new value into localStorage', () => {
      component.showOnlyMyQuestions = true;
      component.toggleshowOnlyMyQuestions();

      expect(localStorage.getItem('showOnlyMyQuestions')).toEqual('false');
    });
  });
});
