import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ServiceDetailComponent } from './service-detail.component';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketI } from '@interfaces/ticket.interface';

describe('ServiceDetailComponent', () => {
  let component: ServiceDetailComponent;
  let fixture: ComponentFixture<ServiceDetailComponent>;
  const tickets = [
    { id: 1, service_id: 1, name: 'Тестовый вопрос 1', ticket_type: 'question' },
    { id: 2, service_id: 2, name: 'Тестовая заявка', ticket_type: 'case' }
  ] as TicketI[];
  const service = ServiceFactory.create({ id: 1, category_id: 1, name: 'Тестовая услуга', tickets: tickets });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ServiceDetailComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDetailComponent);
    component = fixture.componentInstance;
    component.service = service;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show app-section-header component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-section-header')).toBeTruthy();
  });

  it('should show app-dynamic-template-content component', () => {
    expect(fixture.debugElement.nativeElement.querySelectorAll('app-dynamic-template-content').length).toEqual(tickets.length);
  });
});
