import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular//core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { TicketFormComponent } from './ticket-form.component';
import { StubTicketService } from '@shared/services/ticket/ticket.service.stub';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { StubServiceService } from '@shared/services/service/service.service.stub';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceI } from '@interfaces/service.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TagI } from '@interfaces/tag.interface';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { TicketI } from '@interfaces/ticket.interface';
import { TicketFactory } from '@modules/ticket/factories/ticket.factory';

describe('TicketFormComponent', () => {
  let component: TicketFormComponent;
  let fixture: ComponentFixture<TicketFormComponent>;
  let serviceI: ServiceI;
  let service: Service;
  let ticketI: TicketI;
  let ticket: Ticket;
  let serviceService: ServiceService;
  let ticketTag: TagI;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        NgSelectModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [TicketFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: TicketService, useClass: StubTicketService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketFormComponent);
    component = fixture.componentInstance;

    const formBuilder = TestBed.get(FormBuilder);
    serviceService = TestBed.get(ServiceService);
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
      ticket_type: 'question',
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
    ticket = TicketFactory.create(ticketI);

    component.parentForm = formBuilder.group({
      service_id: [service.id],
      name: ['', Validators.required],
      ticket_type: ['question'],
      is_hidden: [true],
      sla: [null],
      to_approve: [false],
      popularity: [0],
      tags: [[]],
      answers: formBuilder.array([])
    });
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set empty array in "tags" Observable', () => {
    fixture.detectChanges();
    component.tags.subscribe(result => {
      expect(result).toEqual([]);
    });
  });

  describe('when ticket exists', () => {
    beforeEach(() => {
      component.ticket = ticket;
      fixture.detectChanges();
    });

    it('should create answer form for each answer', () => {
      expect((component.form.answers as FormArray).length).toEqual(ticketI.answers.length);
    });
  });

  describe('#toggleHidden', () => {
    it('should set "false" value to "is_hidden" attribute', () => {
      fixture.detectChanges();

      expect(component.form.is_hidden.value).toBeTruthy();
      component.toggleHidden(component.parentForm);

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

  describe('Tag features', () => {
    let tags: TagI[];

    beforeEach(() => {
      tags = [
        { id: 1, name: 'Тег 1', popularity: 5 },
        { id: 2, name: 'Тег 2', popularity: 1 }
      ];
      spyOn(serviceService, 'loadTags').and.returnValue(of(tags));
    });

    describe('when ticket exists', () => {
      beforeEach(() => {
        component.ticket = ticket;
        fixture.detectChanges();
      });

      it('should set "selected" attribute to the selected tags', () => {
        tags.forEach(tag => {
          if (tag.id === ticketTag.id) {
            expect(tag.selected).toBeTruthy();
          } else {
            expect(tag.selected).toBeFalsy();
          }
        });
      });
    });

    describe('with any data in ticket (includes empty)', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should create array of service tags', () => {
        const result = tags.map(tag => {
          return {
            data: tag,
            htmlString: `<span class="badge badge-secondary">${tag.name}</span>`
          };
        });

        expect(component.serviceTags).toEqual(result);
      });

      describe('#addTag', () => {
        let tag: TagI;

        beforeEach(() => {
          tag = tags[0];
          fixture.detectChanges();
          component.addTag(tag);
        });

        it('should add tag to "tags" array', () => {
          expect(component.form.tags.value.length).toEqual(1);
        });

        describe('when tag already in array', () => {
          it('should not add tag', () => {
            component.addTag(tag);

            expect(component.form.tags.value.length).toEqual(1);
          });
        });
      });

      describe('#hideTag', () => {
        it('should set true value into "selected" attribute', () => {
          const tag = tags[0];
          component.hideTag(tag);

          expect(tag.selected).toBeTruthy();
        });
      });

      describe('#showTag', () => {
        it('should set false value into "selected" attribute', () => {
          const tag = tags[1];
          component.showTag({ value: tag });

          expect(tag.selected).toBeFalsy();
        });
      });
    });
  });
});
