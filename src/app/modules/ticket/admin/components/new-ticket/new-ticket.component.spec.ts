import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { NewTicketComponent } from './new-ticket.component';
import { ServiceService } from '@shared/services/service/service.service';
import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceI } from '@interfaces/service.interface';

describe('NewTicketComponent', () => {
  let component: NewTicketComponent;
  let fixture: ComponentFixture<NewTicketComponent>;
  let modalService: NgbModal;
  let serviceI: ServiceI;
  let service: Service;
  let serviceService: ServiceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgbModule, NgSelectModule, ReactiveFormsModule],
      declarations: [NewTicketComponent],
      providers: [
        NgbModal,
        { provide: ServiceService, useClass: StubServiceService },
        { provide: TicketService, useClass: StubTicketService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTicketComponent);
    component = fixture.componentInstance;
    modalService = TestBed.get(NgbModal);
    serviceService = TestBed.get(ServiceService);

    serviceI = {
      id: 1,
      category_id: 2,
      name: 'Тестовая услуга',
      is_hidden: false
    } as ServiceI;
    service = ServiceFactory.create(serviceI);

    serviceService.service = service;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set service data in "service" attribute', () => {
    fixture.detectChanges();

    expect(component.service).toEqual(service);
  });

  it('should call "open" method for modalService', () => {
    spyOn(modalService, 'open');

    fixture.detectChanges();
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should set empty array in "tags" Observable', () => {
    fixture.detectChanges();
    component.tags.subscribe(result => {
      expect(result).toEqual([]);
    });
  });

  describe('save', () => {});

  describe('cancel', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should close modal', () => {
      spyOn(component.modal, 'dismiss');
      component.cancel();

      expect(component.modal.dismiss).toHaveBeenCalled();
    });

    it('should redirect to parent component', inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigate');
      spyOn(component.modal, 'dismiss');
      component.cancel();

      expect(spy.calls.first().args[0]).toEqual(['../../../']);
    }));
  });
});
