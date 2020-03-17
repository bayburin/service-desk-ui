import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { SearchPageComponent } from './search.page';
import { SearchService } from '@modules/ticket/services/search/search.service';
import { StubSearchService } from '@modules/ticket/services/search/search.service.stub';
import { UserPolicy } from '@shared/policies/user/user.policy';
import { StubUserPolicy } from '@shared/policies/user/user.policy.stub';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { StubResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service.stub';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';
import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';

describe('SearchComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let searchService: SearchService;
  let userPolicy: UserPolicy;
  let responsibleUserService: ResponsibleUserService;
  let details: ResponsibleUserDetailsI[];
  const term = 'search_term';
  const search = { search: term };
  const stubRoute = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', ['snapshot', 'queryParams']);
  const stubRouteProxy = new Proxy(stubRoute, {
    get(target, prop) {
      if (prop === 'snapshot') {
        return { queryParams: search };
      } else if (prop === 'queryParams') {
        return of(search);
      }
    }
  });
  const searchResult = [
    CategoryFactory.create({ name: 'Тестовая категория' }),
    ServiceFactory.create({ name: 'Тестовая услуга' }),
    TicketFactory.create(TicketTypes.QUESTION, { name: 'Тестовый вопрос', ticket_type: 'question' })
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SearchPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: SearchService, useClass: StubSearchService },
        { provide: ActivatedRoute, useValue: stubRouteProxy },
        { provide: ResponsibleUserService, useClass: StubResponsibleUserService },
        { provide: UserPolicy, useClass: StubUserPolicy },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    searchService = TestBed.get(SearchService);
    userPolicy = TestBed.get(UserPolicy);
    responsibleUserService = TestBed.get(ResponsibleUserService);
    details = [{ tn: 123, full_name: 'ФИО' } as ResponsibleUserDetailsI];
    spyOn(searchService, 'deepSearch').and.returnValue(of(searchResult));
    spyOn((searchResult[1] as any), 'associateResponsibleUserDetails');
    spyOn((searchResult[2] as any), 'associateResponsibleUserDetails');
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should call "deepSearch" method for SearchService instance', () => {
    fixture.detectChanges();

    component.searchResult.subscribe(() => {
      expect(searchService.deepSearch).toHaveBeenCalledWith(term);
    });
  });

  it('should save loaded data in "data" attribute', () => {
    fixture.detectChanges();

    component.searchResult.subscribe(() => {
      expect(component.data).toEqual(searchResult);
    });
  });

  describe('when user authorized for UserPolicy#responsibleUserAccess', () => {
    beforeEach(() => {
      spyOn(userPolicy, 'authorize').and.returnValue(true);
      spyOn(responsibleUserService, 'loadDetails').and.returnValue(of(details));

      fixture.detectChanges();
    });

    it('should call "loadDetails" method of ResponsibleUserService if user authorized', () => {
      expect(responsibleUserService.loadDetails).toHaveBeenCalled();
    });

    it('should call "associateResponsibleUserDetails" method for finded data with occured details', () => {
      expect((searchResult[1] as any).associateResponsibleUserDetails).toHaveBeenCalledWith(details);
      expect((searchResult[2] as any).associateResponsibleUserDetails).toHaveBeenCalledWith(details);
    });
  });

  it('should save search term in "searchTerm" attribute', () => {
    fixture.detectChanges();

    expect(component.searchTerm).toEqual(term);
  });

  it('should show app-global-search component', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('app-global-search')).toBeTruthy();
  });

  it('should show app-search-result component', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('app-search-result')).toBeTruthy();
  });
});
