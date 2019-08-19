import { of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ServicesOverwievPageComponent } from './services-overwiev.page';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { ServiceService } from '@shared/services/service/service.service';

class StubServiceService {
  loadServices() {}
}

describe('ServicesOverwievPageComponent', () => {
  let component: ServicesOverwievPageComponent;
  let fixture: ComponentFixture<ServicesOverwievPageComponent>;
  let service: ServiceService;
  const services = [
    ServiceFactory.create({ id: 1, category_id: 1, name: 'Тестовый сервис 1' }),
    ServiceFactory.create({ id: 2, category_id: 1, name: 'Тестовый сервис 2' })
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesOverwievPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ServiceService, useClass: StubServiceService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesOverwievPageComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ServiceService);
    spyOn(service, 'loadServices').and.returnValue(of(services));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "loadServices" for ServiceService', () => {
    expect(service.loadServices).toHaveBeenCalled();
  });

  it('should show app-section-header component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-section-header')).toBeTruthy();
  });

  it('should show app-service-detail component', () => {
    expect(fixture.debugElement.nativeElement.querySelectorAll('app-service-detail').length).toEqual(2);
  });
});
