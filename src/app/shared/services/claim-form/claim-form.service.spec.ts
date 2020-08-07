import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'environments/environment';
import { ClaimFormService } from './claim-form.service';
import { ClaimFormI } from '@interfaces/claim-form.interface';
import { TicketFactory } from '@modules/ticket/factories/tickets/ticket.factory';

describe('ClaimFormService', () => {
  let httpTestingController: HttpTestingController;
  let claimFormService: ClaimFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    claimFormService = TestBed.get(ClaimFormService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(claimFormService).toBeTruthy();
  });

  describe('#create', () => {
    const claimFormI: ClaimFormI = { ticket: { name: 'Тестовый вопрос', service_id: 1 } } as ClaimFormI;
    const ticketUri = `${environment.serverUrl}/api/v1/services/${claimFormI.ticket.service_id}/app_templates`;
    const expectedTicket = TicketFactory.create(TicketTypes.CLAIM_FORM, claimFormI);

    it('should return Observable with created Ticket', () => {
      claimFormService.create(claimFormI).subscribe(result => {
        expect(result).toEqual(expectedTicket);
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: ticketUri
      }).flush(claimFormI);
    });
  });
});
