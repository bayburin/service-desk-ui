import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { ServicePageContentComponent } from './service-page-content.component';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { ServicePolicy } from '@shared/policies/service/service.policy';
import { StubServicePolicy } from '@shared/policies/service/service.policy.stub';

describe('ServicePageContentComponent', () => {
  let component: ServicePageContentComponent;
  let fixture: ComponentFixture<ServicePageContentComponent>;
  let service: Service;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ServicePageContentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ServicePolicy, useClass: StubServicePolicy }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePageContentComponent);
    component = fixture.componentInstance;
    service = ServiceFactory.create({ id: 1, category_id: 2, name: 'Тестовая категория' });
    component.data = service;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "getShowLink" method for data', () => {
    spyOn(component.data, 'getShowLink');
    component.generateLink();

    expect(component.data.getShowLink).toHaveBeenCalled();
  });

  it('should show link to new case', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain(service.name);
    expect(fixture.debugElement.nativeElement.querySelector('a[href="/categories/2/services/1"]')).toBeTruthy();
  });

  it('should show app-visible-flag component if "showFlags" attribute is equal true', () => {
    expect(fixture.debugElement.query(By.css('app-visible-flag'))).toBeFalsy();
    component.showFlags = true;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-visible-flag'))).toBeTruthy();
  });
});
