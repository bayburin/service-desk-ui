import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { CommonTicketInformationComponent } from './common-ticket-information.component';
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
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { ResponsibleUserFactory } from '@modules/ticket/factories/responsible-user.factory';
import { Question } from '@modules/ticket/models/question/question.model';
import { QuestionI } from '@interfaces/question.interface';
import { TagService } from '@shared/services/tag/tag.service';
import { StubTagService } from '@shared/services/tag/tag.service.stub';

describe('CommonTicketInformationComponent', () => {
  let component: CommonTicketInformationComponent;
  let fixture: ComponentFixture<CommonTicketInformationComponent>;
  let serviceI: ServiceI;
  let service: Service;
  let ticketI: TicketI;
  let ticket: Question;
  let questionI: QuestionI;
  let serviceService: ServiceService;
  let tagService: TagService;
  let ticketTag: TagI;
  let responsibleUserService: ResponsibleUserService;
  let tags: TagI[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        NgSelectModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [CommonTicketInformationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ServiceService, useClass: StubServiceService },
        { provide: TagService, useClass: StubTagService },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonTicketInformationComponent);
    component = fixture.componentInstance;

    const formBuilder = TestBed.get(FormBuilder);
    serviceService = TestBed.get(ServiceService);
    tagService = TestBed.get(TagService);
    responsibleUserService = TestBed.get(ResponsibleUserService);

    serviceI = {
      id: 1,
      category_id: 2,
      name: 'Тестовая услуга',
      is_hidden: false
    } as ServiceI;
    service = ServiceFactory.create(serviceI);
    serviceService.service = service;
    ticketTag = { id: 1, name: 'Тег 1' };
    ticketI = {
      id: 3,
      service_id: service.id,
      name: 'Тестовый вопрос',
      ticketable_id: 4,
      ticketable_type: TicketTypes.QUESTION,
      state: 'draft',
      is_hidden: false,
      sla: null,
      popularity: 0,
      tags: [ticketTag]
    };
    questionI = {
      id: 4,
      original_id: null,
      ticket: ticketI,
      answers: []
    };
    ticket = TicketFactory.create(TicketTypes.QUESTION, questionI);

    component.ticketForm = formBuilder.group({
        service_id: [service.id],
        name: ['', Validators.required],
        is_hidden: [true],
        sla: [null],
        popularity: [0],
        tags: [[]],
        responsible_users: [[]]
    });

    tags = [
      { id: 1, name: 'Тег 1', popularity: 5 },
      { id: 2, name: 'Тег 2', popularity: 1 }
    ];
    spyOn(tagService, 'popular').and.returnValue(of(tags));
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

  describe('#toggleHidden', () => {
    it('should set "false" value to "is_hidden" attribute', () => {
      fixture.detectChanges();

      expect(component.form.is_hidden.value).toBeTruthy();
      component.toggleHidden();

      expect(component.form.is_hidden.value).toBeFalsy();
    });
  });

  describe('Tag features', () => {
    // let tags: TagI[];

    // beforeEach(() => {
    //   tags = [
    //     { id: 1, name: 'Тег 1', popularity: 5 },
    //     { id: 2, name: 'Тег 2', popularity: 1 }
    //   ];
    //   spyOn(tagService, 'popular').and.returnValue(of(tags));
    // });

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

  describe('ResponsibleUser features', () => {
    let details: ResponsibleUserDetailsI[];
    let term;

    beforeEach(() => {
      details = [{ tn: 123, full_name: 'ФИО' } as ResponsibleUserDetailsI];
      spyOn(responsibleUserService, 'searchUsers').and.returnValue(of(details));
      spyOn(ResponsibleUserFactory, 'createByDetails');
      fixture.detectChanges();
    });

    describe('when term is a string', () => {
      beforeEach(() => term = 'string term');

      it('should call "searchUsers" method of ResponsibleUserService service', fakeAsync(() => {
        component.responsibleUserInput.next(term);
        tick(300);
        component.responsibleUsers.subscribe(() => {
          expect(responsibleUserService.searchUsers).toHaveBeenCalledWith('fullName', term);
        });
      }));

      it('should call "createByDetails" method of ResponsibleUserFactory for each occured detail', fakeAsync(() => {
        component.responsibleUserInput.next(term);
        tick(300);
        component.responsibleUsers.subscribe(() => {
          details.forEach(detail => {
            expect(ResponsibleUserFactory.createByDetails).toHaveBeenCalledWith(detail);
          });
        });
      }));
    });

    describe('when term is a number', () => {
      beforeEach(() => term = '12345');

      it('should call "searchUsers" method of ResponsibleUserService service', fakeAsync(() => {
        component.responsibleUserInput.next(term);
        tick(300);
        component.responsibleUsers.subscribe(() => {
          expect(responsibleUserService.searchUsers).toHaveBeenCalledWith('personnelNo', term);
        });
      }));
    });
  });
});
