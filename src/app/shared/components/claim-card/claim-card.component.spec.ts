import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ClaimCardComponent } from './claim-card.component';
import { ClaimService } from '@modules/claim/services/claim/claim.service';
import { ClaimI } from '@interfaces/claim.interface';
import { of } from 'rxjs';
import { StubClaimService } from '@modules/claim/services/claim/claim.service.stub';

describe('ClaimCardComponent', () => {
  let component: ClaimCardComponent;
  let fixture: ComponentFixture<ClaimCardComponent>;
  let claim: ClaimI;
  let claimService: ClaimService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule],
      declarations: [ClaimCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ClaimService, useClass: StubClaimService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    claim = {
      case_id: 1,
      status_id: 1,
      user_tn: 1234,
      dept: '714',
      desc: 'Тестовая заявка',
      status: 'В ожидании',
      ticket: {
        name: 'АСУ ФЭЗ'
      },
      runtime: {
        formatted_starttime: '27.01.2018 15:30',
        formatted_endtime: '31.02.19',
        to_s: '27.01.18 - 31.02.19'
      },
      rating: null
    } as ClaimI;

    fixture = TestBed.createComponent(ClaimCardComponent);
    component = fixture.componentInstance;
    claimService = TestBed.get(ClaimService);
    component.claim = claim;
    fixture.detectChanges();
  });

// Unit ====================================================================================================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#revoke', () => {
    it('should alert with deny message if status_id != 1', () => {
      const message = 'Отменить можно только заявку, имеющую статус "Не обработано". Если вы действительно хотите отменить текущую заявку, обратитесь по тел. 06.';
      spyOn(window, 'alert');
      spyOn(claim, 'status_id').and.returnValue(3);
      spyOn(claimService, 'revoke');
      component.revoke();

      expect(window.alert).toHaveBeenCalledWith(message);
      expect(claimService.revoke).not.toHaveBeenCalled();
    });

    describe('when status_id == 1', () => {
      beforeEach(() => {
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(claimService, 'revoke').and.returnValue(of({}));
        spyOn(window, 'alert');
      });

      it('should revoke claim', () => {
        component.revoke();

        expect(claimService.revoke).toHaveBeenCalledWith(claim.case_id);
      });

      it('should emit true to the removeClaim subject', () => {
        spyOn(component.removeClaim, 'emit');
        component.revoke();

        expect(component.removeClaim.emit).toHaveBeenCalledWith(true);
      });

      it('should alert with message', () => {
        component.revoke();

        expect(window.alert).toHaveBeenCalledWith('Заявка отменена');
      });
    });
  });

  describe('#isAllowedToVote', () => {
    it('should return true if status_id == 3 and kase does not have a rating yet', () => {
      claim.status_id = 3;

      expect(component.isAllowedToVote()).toBeTruthy();
    });
  });

  describe('#vote', () => {
    it('should call "vote" method for claimService', () => {
      spyOn(claimService, 'vote').and.returnValue(of());
      component.vote();

      expect(claimService.vote).toHaveBeenCalledWith(claim);
    });
  });

  describe('#isClosed', () => {
    it('should return true if "isClosed" method of claimService return true', () => {
      spyOn(claimService, 'isClosed');
      component.isClosed();

      expect(claimService.isClosed).toHaveBeenCalledWith(claim);
    });
  });

// Shallow tests ===========================================================================================================================

  describe('Shallow tests', () => {
    it('should show attributes of claim', () => {
      const textContent = fixture.debugElement.nativeElement.textContent;

      expect(textContent).toContain(claim.ticket.name);
      expect(textContent).toContain(`Заявка № ${claim.case_id}`);
      expect(textContent).toContain(claim.runtime.formatted_starttime);
      expect(textContent).toContain(claim.desc);
      expect(textContent).toContain(claim.status);
      expect(textContent).toContain(`Срок выполнения: ${claim.runtime.to_s}`);
      expect(textContent).not.toContain(`Дата закрытия: ${claim.runtime.formatted_endtime}`);

    });

    it('should show "formatted_endtime" if claim closed', () => {
      spyOn(component, 'isClosed').and.returnValue(true);
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toContain(`Дата закрытия: ${claim.runtime.formatted_endtime}`);
    });

    it('should not show rating if claim was not closed', () => {
      expect(fixture.debugElement.nativeElement.querySelector('ngb-rating')).not.toBeTruthy();
    });

    it('should set rating to the claim', () => {
      spyOn(claimService, 'vote').and.returnValue(of({}));
      claim.status_id = 3;
      fixture.detectChanges();
      const star = fixture.debugElement.nativeElement.querySelector('span.star');

      star.click();
      fixture.whenStable().then(() => {
        expect(claimService.vote).toHaveBeenCalledTimes(2);
      });
    });

    it('should show alert with error message on close button if status_id != 1', () => {
      claim.status_id = 2;
      spyOn(window, 'alert');
      fixture.debugElement.nativeElement.querySelector('#revoke').click();

      expect(window.alert).toHaveBeenCalledWith('Отменить можно только заявку, имеющую статус "Не обработано". Если вы действительно хотите отменить текущую заявку, обратитесь по тел. 06.');
    });

    it('should close the claim', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(claimService, 'revoke').and.returnValue(of({}));
      spyOn(component.removeClaim, 'emit');
      spyOn(window, 'alert');
      fixture.debugElement.nativeElement.querySelector('#revoke').click();
      fixture.detectChanges();

      expect(claimService.revoke).toHaveBeenCalledWith(claim.case_id);
      expect(component.removeClaim.emit).toHaveBeenCalledWith(true);
      expect(window.alert).toHaveBeenCalledWith('Заявка отменена');
    });
  });
});
