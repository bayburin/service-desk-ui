import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ServicesDetailPageComponent } from './services-detail.page';
import { ServiceService } from '@shared/services/service/service.service';
import { ActivatedRoute } from '@angular/router';
import { ServiceDetailComponent } from '@modules/ticket/components/service-detail/service-detail.component';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketI } from '@interfaces/ticket.interface';

class StubServiceService {
  loadService() {}
}

describe('ServicesDetailPageComponent', () => {
  let component: ServicesDetailPageComponent;
  let fixture: ComponentFixture<ServicesDetailPageComponent>;
  let serviceService: ServiceService;
  const tickets = [
    { id: 1, service_id: 2, name: 'Тестовый вопрос 1', ticket_type: 'question' } as TicketI,
    { id: 2, service_id: 2, name: 'Тестовый вопрос 2', ticket_type: 'question' } as TicketI,
  ];
  const service = ServiceFactory.create({ id: 2, name: 'Тестовая заявка', category_id: 3, tickets: tickets });
  const stubRoute = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', ['snapshot', 'parent']);
  const stubRouteProxy = new Proxy(stubRoute, {
    get(target, prop) {
      if (prop === 'snapshot') {
        return {
          queryParams: { ticket: '1' },
          params: { id: '2' }
        };
      } else if (prop === 'parent') {
        return {
          snapshot: { params: { id: '3' } }
        };
      }
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule],
      declarations: [ServicesDetailPageComponent, ServiceDetailComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: ActivatedRoute, useValue: stubRouteProxy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDetailPageComponent);
    component = fixture.componentInstance;
    serviceService = TestBed.get(ServiceService);
    spyOn(serviceService, 'loadService').and.returnValue(of(service));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save id of ticket in "ticketId" attribute', () => {
    expect((component as any).ticketId).toEqual('1');
  });

  it('should call "loadService" method for ServiceService instance', () => {
    expect(serviceService.loadService).toHaveBeenCalledWith('3', '2');
  });

  it('should save loaded data in "service" variable', () => {
    expect(component.service).toEqual(service);
  });

  it('should render app-service-detail component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-service-detail')).toBeTruthy();
  });
});
