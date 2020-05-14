import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { ServiceDetailComponent } from './service-detail.component';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';

describe('ServiceDetailComponent', () => {
  let component: ServiceDetailComponent;
  let fixture: ComponentFixture<ServiceDetailComponent>;
  let service: Service;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule],
      declarations: [ServiceDetailComponent],
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
      question_tickets: [
        { id: 2, ticket: { name: 'Вопрос 1' } },
        { id: 3, ticket: { name: 'Вопрос 2' } }
      ]
    });
    component.service = service;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show app-section-header component', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('app-section-header');
  });

  it('should show app-question components', () => {
    expect(fixture.debugElement.nativeElement.querySelectorAll('app-question').length).toEqual(service.questionTickets.length);
  });

  it('should show link to user mode', () => {
    expect(fixture.debugElement.nativeElement.querySelector('#userMode')).toBeTruthy();
  });

  it('should show app-responsible-user-details component', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-responsible-user-details'))).toBeTruthy();
  });
});
