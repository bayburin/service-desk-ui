import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CasePageContentComponent } from './case-page-content.component';
import { Ticket, TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';

describe('CasePageContentComponent', () => {
  let component: CasePageContentComponent;
  let fixture: ComponentFixture<CasePageContentComponent>;
  let ticket: Ticket;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CasePageContentComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasePageContentComponent);
    component = fixture.componentInstance;
    ticket = TicketFactory.create(TicketTypes.CASE, { id: 1, serviceId: 2, name: 'Тестовая заявка' });
    component.data = ticket;
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
    expect(fixture.debugElement.nativeElement.textContent).toContain(ticket.name);
    expect(fixture.debugElement.nativeElement.querySelector('a[href="/Need%20implementation"]')).toBeTruthy();
  });
});
