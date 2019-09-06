import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NewTicketComponent } from './new-ticket.component';
import { ServiceService } from '@shared/services/service/service.service';
import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceI } from '@interfaces/service.interface';
import { TagI } from '@interfaces/tag.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';

describe('NewTicketComponent', () => {
  let component: NewTicketComponent;
  let fixture: ComponentFixture<NewTicketComponent>;
  let modalService: NgbModal;
  let serviceI: ServiceI;
  let service: Service;
  let serviceService: ServiceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModule,
        NgSelectModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [NewTicketComponent],
      schemas: [NO_ERRORS_SCHEMA],
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

  it('should create array of service tags', () => {
    const tags: TagI[] = [
      { id: 1, name: 'Tag 1', popularity: 5 },
      { id: 2, name: 'Tag 2', popularity: 1 }
    ];
    spyOn(serviceService, 'loadTags').and.returnValue(of(tags));
    fixture.detectChanges();

    expect(component.serviceTags).toEqual(tags.map(tag => `<span class="badge badge-secondary">${tag.name}</span>`));
  });

  describe('#addAnswer', () => {
    it('should add formgroup to "answers_attributes" formarray', () => {
      fixture.detectChanges();
      component.addAnswer();

      expect((component.form.answers_attributes as FormArray).controls.length).toEqual(2);
    });
  });

  describe('#toggleHidden', () => {
    it('should set "false" value to "is_hidden" attribute', () => {
      fixture.detectChanges();
      expect(component.form.is_hidden.value).toBeTruthy();
      component.toggleHidden(component.ticketForm);

      expect(component.form.is_hidden.value).toBeFalsy();
    });
  });

  describe('#deleteAnswer', () => {
    it('should delete answer from answers_attributes', () => {
      fixture.detectChanges();
      const answer = (component.form.answers_attributes as FormArray).controls[0] as FormGroup;
      answer.controls.answer.setValue('Это ответ');
      component.deleteAnswer(answer);
      expect((component.form.answers_attributes as FormArray).length).toEqual(0);
    });
  });

  describe('#save', () => {
    let ticketService: TicketService;

    beforeEach(() => {
      ticketService = TestBed.get(TicketService);
    });

    describe('when form is invalid', () => {
      it('should not save ticket', () => {
        spyOn(ticketService, 'createTicket');
        fixture.detectChanges();
        component.save();

        expect(ticketService.createTicket).not.toHaveBeenCalled();
      });
    });

    describe('when form valid', () => {
      beforeEach(() => {
        fixture.detectChanges();
        component.form.name.setValue('Тестовый вопрос');
        ((component.form.answers_attributes as FormArray).controls[0] as FormGroup).controls.answer.setValue('Это ответ');
        spyOn(ticketService, 'createTicket').and.returnValue(of({}));
      });

      it('should call "createTicket" method from TicketService with ticket params', () => {
        component.save();

        expect(ticketService.createTicket).toHaveBeenCalledWith(component.ticketForm.getRawValue());
      });

      it('should close modal', () => {
        spyOn(component.modal, 'close');
        component.save();

        expect(component.modal.close).toHaveBeenCalled();
      });

      it('should redirect to parent page', inject([Router], (router: Router) => {
        const spy = spyOn(router, 'navigate');
        component.save();

        expect(spy.calls.first().args[0]).toEqual(['../../../']);
      }));

      it('should emit to "ticketSaved" event', () => {
        spyOn(component.ticketSaved, 'emit');
        component.save();

        expect(component.ticketSaved.emit).toHaveBeenCalled();
      });
    });
  });

  describe('#cancel', () => {
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
