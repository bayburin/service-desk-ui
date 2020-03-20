import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NO_ERRORS_SCHEMA, forwardRef, Component } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { TicketFormComponent } from './ticket-form.component';
import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceI } from '@interfaces/service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TagI } from '@interfaces/tag.interface';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketI } from '@interfaces/ticket.interface';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { StubResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service.stub';
import { QuestionTicket } from '@modules/ticket/models/question_ticket/question_ticket.model';

@Component({
  selector: 'app-answer-accessor',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StubAnswerAccessorComponent),
      multi: true
    }
  ]
})
class StubAnswerAccessorComponent implements ControlValueAccessor {
  writeValue(value: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}

describe('TicketFormComponent', () => {
  let component: TicketFormComponent;
  let fixture: ComponentFixture<TicketFormComponent>;
  let serviceI: ServiceI;
  let service: Service;
  let ticketI: TicketI;
  let ticket: QuestionTicket;
  let serviceService: ServiceService;
  let ticketTag: TagI;
  let responsibleUserService: ResponsibleUserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        NgSelectModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [TicketFormComponent, StubAnswerAccessorComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: TicketService, useClass: StubTicketService },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketFormComponent);
    component = fixture.componentInstance;

    const formBuilder = TestBed.get(FormBuilder);
    serviceService = TestBed.get(ServiceService);
    responsibleUserService = TestBed.get(ResponsibleUserService);

    serviceI = {
      id: 1,
      category_id: 2,
      name: 'Тестовая услуга',
      is_hidden: false
    } as ServiceI;
    service = ServiceFactory.create(serviceI);
    ticketTag = { id: 1, name: 'Тег 1' };
    ticketI = {
      id: 3,
      service_id: 1,
      original_id: null,
      name: 'Тестовый вопрос',
      ticket_type: TicketTypes.QUESTION,
      state: 'draft',
      is_hidden: false,
      sla: null,
      to_approve: false,
      popularity: 0,
      answers: [
        { id: 1, ticket_id: 3, reason: '', answer: 'Ответ 1', attachments: [], link: '', is_hidden: false },
        { id: 2, ticket_id: 3, reason: '', answer: 'Ответ 2', attachments: [], link: '', is_hidden: true }
      ],
      tags: [ticketTag]
    };
    ticket = TicketFactory.create(TicketTypes.QUESTION, ticketI);

    component.ticketForm = formBuilder.group({
      service_id: [service.id],
      name: ['', Validators.required],
      ticket_type: [TicketTypes.QUESTION],
      is_hidden: [true],
      sla: [null],
      to_approve: [false],
      popularity: [0],
      tags: [[]],
      answers: formBuilder.array([]),
      responsible_users: [[]]
    });
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('when ticket exists', () => {
    beforeEach(() => {
      component.ticket = ticket;
      fixture.detectChanges();
    });

    it('should create answer form for each answer', () => {
      expect(component.answers_form.length).toEqual(ticketI.answers.length);
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

  describe('#addAnswer', () => {
    it('should add formgroup to "answers" formarray', () => {
      fixture.detectChanges();
      component.addAnswer();

      expect((component.form.answers as FormArray).controls.length).toEqual(1);
    });
  });

  describe('#deleteAnswer', () => {
    it('should delete answer from answers_attributes', () => {
      fixture.detectChanges();
      component.addAnswer();
      const answer = (component.form.answers as FormArray).controls[0] as FormGroup;
      answer.controls.answer.setValue('Это ответ');
      component.deleteAnswer(answer);

      expect((component.form.answers as FormArray).length).toEqual(0);
    });

    describe('when ticket exists', () => {
      beforeEach(() => {
        component.ticket = ticket;
        fixture.detectChanges();
      });

      it('should set "_destroy" value to answer formControl', () => {
        const answer = (component.form.answers as FormArray).controls[0] as FormGroup;
        component.deleteAnswer(answer);

        expect(answer.controls._destroy.value).toBeTruthy();
      });
    });
  });

  it('should show app-common-ticket-information component', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-common-ticket-information'))).toBeTruthy();
  });
});
