import { TicketTypes } from '@modules/ticket/models/ticket/ticket.model';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { TicketI } from '@interfaces/ticket.interface';
import { ClaimForm } from '@modules/ticket/models/claim-form/claim-form.model';
import { ServiceI } from '@interfaces/service.interface';
import { ClaimFormI } from '@interfaces/claim-form.interface';

describe('ClaimForm', () => {
  let serviceI: ServiceI;
  let ticketI: TicketI;
  let responsibleUserI: ResponsibleUserI;
  let ticket: ClaimForm;
  let claimFormI: ClaimFormI;

  beforeEach(() => {
    responsibleUserI = {
      id: 1,
      tn: 123,
      responseable_type: 'Service',
      responseable_id: 1
    } as ResponsibleUserI;
    serviceI = {
      id: 2,
      name: 'Тестовая услуга',
      category_id: 3,
      responsible_users: [responsibleUserI]
    } as ServiceI;
    ticketI = {
      id: 1,
      identity: 1,
      service_id: 1,
      name: 'Тестовый вопрос',
      ticketable_id: 1,
      ticketable_type: TicketTypes.CLAIM_FORM,
      state: 'draft',
      is_hidden: false,
      sla: 2,
      popularity: 34,
      service: serviceI,
      responsible_users: [responsibleUserI],
    };
    claimFormI = {
      id: 1,
      description: 'test',
      destination: 'http://destination',
      message: 'msg',
      info: 'info msg',
      ticket: ticketI,
    };
  });

  it('should set "claim_form" ticketType attribute', () => {
    ticket = new ClaimForm(claimFormI);

    expect(ticket.ticketType).toEqual(TicketTypes.CLAIM_FORM);
  });

  describe('Constructor', () => {
    it('should create instance of Question', () => {
      expect(new ClaimForm(claimFormI)).toBeTruthy();
    });

    it('should accept values', () => {
      const form = new ClaimForm(claimFormI);

      expect(form.id).toEqual(claimFormI.id);
      expect(form.description).toEqual(claimFormI.description);
      expect(form.destination).toEqual(claimFormI.destination);
      expect(form.message).toEqual(claimFormI.message);
      expect(form.info).toEqual(claimFormI.info);
      expect(form.name).toEqual(ticketI.name);
    });
  });
})
