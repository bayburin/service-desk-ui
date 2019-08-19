import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ServicePageContentComponent } from './service-page-content.component';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';

describe('ServicePageContentComponent', () => {
  let component: ServicePageContentComponent;
  let fixture: ComponentFixture<ServicePageContentComponent>;
  let service: Service;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ServicePageContentComponent]
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
});
