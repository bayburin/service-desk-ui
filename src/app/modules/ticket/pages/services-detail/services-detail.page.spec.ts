import { Directive, Input, Component, Output, EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AuthorizeDirective } from '@shared/directives/authorize/authorize.directive';
import { ServicesDetailPageComponent } from './services-detail.page';
import { ServiceService } from '@shared/services/service/service.service';
import { ActivatedRoute } from '@angular/router';
import { ServiceDetailComponent } from '@modules/ticket/components/service-detail/service-detail.component';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketI } from '@interfaces/ticket.interface';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { UserService } from '@shared/services/user/user.service';
import { StubUserService } from '@shared/services/user/user.service.stub';
import { UserPolicy } from '@shared/policies/user/user.policy';
import { StubUserPolicy } from '@shared/policies/user/user.policy.stub';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { StubResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service.stub';

// @Directive({
//   selector: '[appAuthorize]'
// })
// class StubAuthorizeDirective extends AuthorizeDirective {
//   @Input() set appAuthorize(policyData: [any, string]) {}
// }

// @Component({
//   template: ''
// })
// class TestComponent {
//   @Output() ticketSaved = new EventEmitter();
// }

describe('ServicesDetailPageComponent', () => {
  let component: ServicesDetailPageComponent;
  let fixture: ComponentFixture<ServicesDetailPageComponent>;
  let serviceService: ServiceService;
  let userPolicy: UserPolicy;
  let responsibleUserService: ResponsibleUserService;
  const tickets = [
    { id: 1, service_id: 2, name: 'Тестовый вопрос 1', ticket_type: 'question' } as TicketI,
    { id: 2, service_id: 2, name: 'Тестовый вопрос 2', ticket_type: 'question' } as TicketI
  ];
  const service = ServiceFactory.create({ id: 2, name: 'Тестовая заявка', category_id: 3, tickets });
  const stubRoute = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', ['snapshot', 'parent', 'children']);
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
      } else if (prop === 'children') {
        return [];
      }
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule],
      declarations: [
        ServicesDetailPageComponent,
        // ServiceDetailComponent
        // StubAuthorizeDirective,
        // TestComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: ActivatedRoute, useValue: stubRouteProxy },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService },
        { provide: UserPolicy, useClass: StubUserPolicy }
        // { provide: UserService, useClass: StubUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDetailPageComponent);
    component = fixture.componentInstance;
    serviceService = TestBed.get(ServiceService);
    userPolicy = TestBed.get(UserPolicy);
    responsibleUserService = TestBed.get(ResponsibleUserService);
    spyOn(serviceService, 'loadService').and.returnValue(of(service));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save id of ticket in "ticketId" attribute', () => {
    expect((component as any).ticketId).toEqual('1');
  });

  it('should call "loadService" method of ServiceService instance', () => {
    expect(serviceService.loadService).toHaveBeenCalledWith('3', '2');
  });

  it('should save loaded data in "service" variable', () => {
    expect(component.service).toEqual(service);
  });

  describe('when user authorized for UserPolicy#responsibleUserAccess', () => {
    beforeEach(() => {
      spyOn(userPolicy, 'authorize').and.returnValue(true);
      spyOn(responsibleUserService, 'loadDetails').and.returnValue(of(null));
      spyOn(responsibleUserService, 'associateDetailsFor');
      component.loadService();
    });

    it('should call "loadDetails" method of ResponsibleUserService if user authorized', () => {
      expect(responsibleUserService.loadDetails).toHaveBeenCalled();
    });

    it('should call "associateDetailsFor" method of ResponsibleUserService for service and each ticket', () => {
      expect(responsibleUserService.associateDetailsFor).toHaveBeenCalledWith(component.service);
      component.service.tickets.forEach(ticket => {
        expect(responsibleUserService.associateDetailsFor).toHaveBeenCalledWith(ticket);
      });
    });
  });

  it('should render app-service-detail component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-service-detail')).toBeTruthy();
  });
});
