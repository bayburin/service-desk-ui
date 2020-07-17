import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, tick, fakeAsync, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BreadcrumbComponent } from './breadcrumb.component';
import { CategoriesPageComponent } from '@modules/ticket/pages/categories/categories.page';
import { ServiceService } from '@shared/services/service/service.service';
import { CategoryService } from '@shared/services/category/category.service';
import { ServicesDetailPageComponent } from '@modules/ticket/pages/services-detail/services-detail.page';
import { TicketModule } from '@modules/ticket/ticket.module';
import { APP_CONFIG, AppConfig } from '@config/app.config';
import { AuthGuard } from '@guards/auth/auth.guard';
import { SearchPageComponent } from '@modules/ticket/pages/search/search.page';
import { StubCategoryService } from '@shared/services/category/category.service.stub';
import { StubServiceService } from '@shared/services/service/service.service.stub';

const routes: Routes = [
  {
    path: 'categories/:id',
    component: CategoriesPageComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: [CategoryService, ServiceService] },
    children: [
      {
        path: 'services/:id',
        component: ServicesDetailPageComponent,
        data: { breadcrumb: ServiceService }
      }
    ]
  },
  {
    path: 'search',
    component: SearchPageComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Поиск' }
  }
];

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let router: Router;
  let categoryService: CategoryService;
  let serviceService: ServiceService;
  let authGuard: AuthGuard;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        TicketModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CategoryService, useClass: StubCategoryService },
        { provide: ServiceService, useClass: StubServiceService },
        { provide: APP_CONFIG, useValue: AppConfig },
        AuthGuard
      ],
      declarations: [BreadcrumbComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;

    categoryService = TestBed.get(CategoryService);
    serviceService = TestBed.get(ServiceService);
    router = TestBed.get(Router);
    authGuard = TestBed.get(AuthGuard);
    spyOn(authGuard, 'canActivate').and.returnValue(true);
  });

  it('should create array of breadcrumbs before navigation fired', fakeAsync(() => {
    router.navigateByUrl('/categories/1/services/2');
    tick();

    fixture.detectChanges();
    expect(component.breadcrumbs.length).toEqual(2);
  }));

  describe('after component init', () => {
    beforeEach(() => { fixture.detectChanges(); });

// Unit ====================================================================================================================================

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should create array of breadcrumbs', fakeAsync(() => {
      router.navigateByUrl('/categories/1/services/2');
      tick();

      expect(component.breadcrumbs.length).toEqual(2);
    }));

    it('should fill each element of array with BreadcrumbI object', fakeAsync(() => {
      router.navigateByUrl('/categories/1/services/2');
      tick();

      const breadcrumb = component.breadcrumbs[0];

      breadcrumb.label.subscribe(label => {
        expect(label).toEqual('Программные комплексы (из категории)');
      });
      expect(breadcrumb.url).toEqual('categories/1/');
    }));

    it('should take label from route if it is exists', fakeAsync(() => {
      router.navigateByUrl('/search');
      tick();

      component.breadcrumbs[0].label.subscribe(label => {
        expect(label).toEqual('Поиск');
      });
    }));

// Shallow tests ==========================================================================================================================

    it('should build breadcrumbs', fakeAsync(() => {
      router.navigateByUrl('/categories/1/services/2');
      tick();
      fixture.detectChanges();
      const text = fixture.debugElement.nativeElement.textContent;

      expect(text).toContain('Главная');
      expect(text).toContain('Программные комплексы (из категории)');
      expect(text).toContain('nanoCad');
    }));

    it('should show category name from service if category has not been loaded', fakeAsync(() => {
      spyOn(categoryService, 'getNodeName').and.returnValue(of(''));
      router.navigateByUrl('/categories/1/services/2');
      tick();
      fixture.detectChanges();
      const text = fixture.debugElement.nativeElement.textContent;

      expect(text).toContain('Главная');
      expect(text).toContain('Программные комплексы (из сервиса)');
      expect(text).toContain('nanoCad');
    }));

    it('should retirect to dashboard page', fakeAsync(inject([Location], (location: Location) => {
      router.navigateByUrl('/categories/1/services/2');
      tick();
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a:not(.breadcrumb-item)').click();
      tick();

      expect(location.path()).toBe('/');
    })));

    it('should redirect to the categories page', fakeAsync(inject([Location], (location: Location) => {
      router.navigateByUrl('/categories/1/services/2');
      tick();
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a.breadcrumb-item:nth-child(1)').click();
      tick();

      expect(location.path()).toBe('/categories/1');
    })));
  });
});
