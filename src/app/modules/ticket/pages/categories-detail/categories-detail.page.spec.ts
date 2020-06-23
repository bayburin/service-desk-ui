import { ServiceI } from '@interfaces/service.interface';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CategoriesDetailPageComponent } from './categories-detail.page';
import { CategoryService } from '@shared/services/category/category.service';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { TicketI } from '@interfaces/ticket.interface';
import { StubCategoryService } from '@shared/services/category/category.service.stub';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

describe('CategoriesDetailPageComponent', () => {
  let component: CategoriesDetailPageComponent;
  let fixture: ComponentFixture<CategoriesDetailPageComponent>;
  let categoryService: CategoryService;
  const tickets = [
    { id: 4, service_id: 1, name: 'Вопрос' } as TicketI,
    { id: 4, service_id: 1, name: 'Заявка' } as TicketI
  ];
  const services = [
    { id: 2, category_id: 1, name: 'Тестовая услуга 1' } as ServiceI,
    { id: 3, category_id: 1, name: 'Тестовая услуга 2' } as ServiceI
  ];
  const category = CategoryFactory.create({ id: 1, name: 'Тестовая категория', services, faq: tickets });

  describe('with custom route provider', () => {
    const paramId = 12;
    const stubRoute = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', ['snapshot']);
    const stubRouteProxy = new Proxy(stubRoute, {
      get(target, prop) {
        if (prop === 'snapshot') {
          return {
            params: { id: paramId }
          };
        }
      }
    });

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, NoopAnimationsModule],
        declarations: [CategoriesDetailPageComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: CategoryService, useClass: StubCategoryService },
          { provide: ActivatedRoute, useValue: stubRouteProxy }
        ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(CategoriesDetailPageComponent);
      component = fixture.componentInstance;
      categoryService = TestBed.get(CategoryService);
      spyOn(categoryService, 'loadCategory').and.returnValue(of(category));
      fixture.detectChanges();
    });

    it('should call "loadCategory" method for CategoryService', () => {
      expect(categoryService.loadCategory).toHaveBeenCalledWith(paramId);
    });
  });

  describe('Other specs', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, NoopAnimationsModule],
        declarations: [CategoriesDetailPageComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [{ provide: CategoryService, useClass: StubCategoryService }]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(CategoriesDetailPageComponent);
      component = fixture.componentInstance;
      categoryService = TestBed.get(CategoryService);
      spyOn(categoryService, 'loadCategory').and.returnValue(of(category));
      fixture.detectChanges();
    });

// Unit ====================================================================================================================================

    it('should create', () => {
      expect(component).toBeTruthy();
    });

// Shallow tests ===========================================================================================================================

    it('should show app-section-header component', () => {
      expect(fixture.debugElement.nativeElement.querySelector('app-section-header')).toBeTruthy();
    });

    it('should show link to each service', () => {
      services.forEach(service => {
        expect(fixture.debugElement.nativeElement.querySelector(`a[href="/services/${service.id}"]`)).toBeTruthy();
      });
    });

    it('should show app-claims-page-content component', () => {
      expect(fixture.debugElement.nativeElement.querySelector('app-claims-page-content')).toBeTruthy();
    });

    it('should render app-question-page-content components', () => {
      expect(fixture.debugElement.nativeElement.querySelectorAll('app-question-page-content').length).toEqual(tickets.length);
    });
  });
});
