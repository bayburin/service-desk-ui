import { DashboardI } from '@interfaces/dashboard.interface';
import { of } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardService } from '@modules/ticket/services/dashboard/dashboard.service';
import { DashboardPageComponent } from './dashboard.page';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketI } from '@interfaces/ticket.interface';
import { UserRecommendationI } from '@interfaces/user-recommendation.interface';
import { StubDashboardService } from '@modules/ticket/services/dashboard/dashboard.service.stub';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { QuestionI } from '@interfaces/question.interface';

describe('DashboardComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let dashboardService: DashboardService;
  const categories = [
    CategoryFactory.create({ id: 1, name: 'Категория 1' }),
    CategoryFactory.create({ id: 2, name: 'Категория 2' })
  ];
  const questions1 = [
    { id: 1, ticket: { name: 'Тестовый вопрос 1', ticketable_type: TicketTypes.QUESTION } as TicketI } as QuestionI,
    { id: 2, ticket: { name: 'Тестовый вопрос 2', ticketable_type: TicketTypes.QUESTION } as TicketI } as QuestionI,
    { id: 3, ticket: { name: 'Тестовый вопрос 3', ticketable_type: TicketTypes.QUESTION } as TicketI } as QuestionI,
    { id: 3, ticket: { name: 'Тестовый вопрос 4', ticketable_type: TicketTypes.QUESTION } as TicketI } as QuestionI
  ];
  const questions2 = [
    { id: 3, ticket: { name: 'Тестовый вопрос 5', ticketable_type: TicketTypes.QUESTION } as TicketI } as QuestionI,
    { id: 4, ticket: { name: 'Тестовый вопрос 6', ticketable_type: TicketTypes.QUESTION } as TicketI } as QuestionI
  ];
  const services = [
    ServiceFactory.create({ id: 3, category_id: 1, name: 'Услуга 1', questions: questions1 }),
    ServiceFactory.create({ id: 4, category_id: 2, name: 'Услуга 2', questions: questions2 })
  ];
  const recommendations = [
    { id: 1, title: 'Рекоммендация 1', order: 10 },
    { id: 2, title: 'Рекоммендация 2', order: 20 }
  ] as UserRecommendationI[];
  const result: DashboardI = {
    categories,
    services,
    user_recommendations: recommendations
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule],
      declarations: [DashboardPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: DashboardService, useClass: StubDashboardService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.get(DashboardService);
    spyOn(dashboardService, 'loadAll').and.returnValue(of(result));
    fixture.detectChanges();
  });

// Unit ====================================================================================================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "loadAll" method for DashboardService instance', () => {
    expect(dashboardService.loadAll).toHaveBeenCalled();
  });

  it('should set "questionLimit" variable', () => {
    services.forEach(service => {
      expect(service.questionLimit).toEqual(component.limits.questions);
    });
  });

  it('should set "data" variable', () => {
    expect(component.data).toEqual(result);
  });

  describe('#toggleQuestionLimit', () => {
    it('should set max length if "isNeedToDropDown" method returns true', () => {
      spyOn(component, 'isNeedToDropDown').and.returnValue(true);
      component.toggleQuestionLimit(services[0]);

      expect(services[0].questionLimit).toEqual(questions1.length + 1);
    });

    it('should set default length if "isNeedToDropDown" method returns false', () => {
      spyOn(component, 'isNeedToDropDown').and.returnValue(false);
      component.toggleQuestionLimit(services[0]);

      expect(services[0].questionLimit).toEqual(component.limits.questions);
    });
  });

  describe('#isNeedToDropDown', () => {
    it('should return true if "questionLimit" is less than length of tickets', () => {
      expect(component.isNeedToDropDown(services[0])).toBeTruthy();
      expect(component.isNeedToDropDown(services[1])).toBeFalsy();
    });
  });

// Shallow tests ===========================================================================================================================

  it('should show app-global-search component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-global-search')).toBeTruthy();
  });

  it('should show user recommendations', () => {
    recommendations.forEach(rec => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(rec.title);
    });
  });

  it('should show app-category-list component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-category-list')).toBeTruthy();
  });

  it('should redirect to all categories', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigateByUrl');
    fixture.debugElement.nativeElement.querySelector('#allCategories').click();

    expect(`${spy.calls.first().args[0]}`).toEqual('/categories');
  }));

  it('should show name of services', () => {
    services.forEach(service => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(service.name);
    });
  });

  it('should show limited faq', () => {
    questions2.forEach(question => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(question.ticket.name);
    });
    questions1.slice(0, component.limits.questions).forEach(question => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(question.ticket.name);
    });
    questions1.slice(-(questions1.length - component.limits.questions)).forEach(question => {
      expect(fixture.debugElement.nativeElement.textContent).not.toContain(question.ticket.name);
    });
  });

  it('should show all questions for service', () => {
    fixture.debugElement.nativeElement.querySelector('span').click();
    fixture.detectChanges();

    questions1.forEach(question => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(question.ticket.name);
    });
  });

  it('should redirect to all questions', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigateByUrl');
    fixture.debugElement.nativeElement.querySelector('#allQuestions').click();

    expect(`${spy.calls.first().args[0]}`).toEqual('/services');
  }));
});
