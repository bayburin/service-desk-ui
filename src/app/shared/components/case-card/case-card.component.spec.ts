import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CaseCardComponent } from './case-card.component';
import { CaseService } from '@modules/case/services/case/case.service';
import { CaseI } from '@interfaces/case.interface';
import { of } from 'rxjs';
import { StubCaseService } from '@modules/case/services/case/case.service.stub';

describe('CaseCardComponent', () => {
  let component: CaseCardComponent;
  let fixture: ComponentFixture<CaseCardComponent>;
  let kase: CaseI;
  let caseService: CaseService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule],
      declarations: [CaseCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: CaseService, useClass: StubCaseService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    kase = {
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
    } as CaseI;

    fixture = TestBed.createComponent(CaseCardComponent);
    component = fixture.componentInstance;
    caseService = TestBed.get(CaseService);
    component.kase = kase;
    fixture.detectChanges();
  });

// Unit ====================================================================================================================================

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#revokeCase', () => {
    it('should alert with deny message if status_id != 1', () => {
      const message = 'Отменить можно только заявку, имеющую статус "Не обработано". Если вы действительно хотите отменить текущую заявку, обратитесь по тел. 06.';
      spyOn(window, 'alert');
      spyOn(kase, 'status_id').and.returnValue(3);
      spyOn(caseService, 'revokeCase');
      component.revokeCase();

      expect(window.alert).toHaveBeenCalledWith(message);
      expect(caseService.revokeCase).not.toHaveBeenCalled();
    });

    describe('when status_id == 1', () => {
      beforeEach(() => {
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(caseService, 'revokeCase').and.returnValue(of({}));
        spyOn(window, 'alert');
      });

      it('should revoke case', () => {
        component.revokeCase();

        expect(caseService.revokeCase).toHaveBeenCalledWith(kase.case_id);
      });

      it('should emit true to the removeCase subject', () => {
        spyOn(component.removeCase, 'emit');
        component.revokeCase();

        expect(component.removeCase.emit).toHaveBeenCalledWith(true);
      });

      it('should alert with message', () => {
        component.revokeCase();

        expect(window.alert).toHaveBeenCalledWith('Заявка отменена');
      });
    });
  });

  describe('#isAllowedToVote', () => {
    it('should return true if status_id == 3 and kase does not have a rating yet', () => {
      kase.status_id = 3;

      expect(component.isAllowedToVote()).toBeTruthy();
    });
  });

  describe('#vote', () => {
    it('should call "voteCase" method for caseService', () => {
      spyOn(caseService, 'voteCase').and.returnValue(of());
      component.vote();

      expect(caseService.voteCase).toHaveBeenCalledWith(kase);
    });
  });

  describe('#isCaseClosed', () => {
    it('should return true if "isClosed" method of caseService return true', () => {
      spyOn(caseService, 'isClosed');
      component.isCaseClosed();

      expect(caseService.isClosed).toHaveBeenCalledWith(kase);
    });
  });

// Shallow tests ===========================================================================================================================

  describe('Shallow tests', () => {
    it('should show attributes of case', () => {
      const textContent = fixture.debugElement.nativeElement.textContent;

      expect(textContent).toContain(kase.ticket.name);
      expect(textContent).toContain(`Заявка № ${kase.case_id}`);
      expect(textContent).toContain(kase.runtime.formatted_starttime);
      expect(textContent).toContain(kase.desc);
      expect(textContent).toContain(kase.status);
      expect(textContent).toContain(`Срок выполнения: ${kase.runtime.to_s}`);
      expect(textContent).not.toContain(`Дата закрытия: ${kase.runtime.formatted_endtime}`);

    });

    it('should show "formatted_endtime" if case closed', () => {
      spyOn(component, 'isCaseClosed').and.returnValue(true);
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toContain(`Дата закрытия: ${kase.runtime.formatted_endtime}`);
    });

    it('should not show rating if case was not closed', () => {
      expect(fixture.debugElement.nativeElement.querySelector('ngb-rating')).not.toBeTruthy();
    });

    it('should set rating to the case', () => {
      spyOn(caseService, 'voteCase').and.returnValue(of({}));
      kase.status_id = 3;
      fixture.detectChanges();
      const star = fixture.debugElement.nativeElement.querySelector('span.star');

      star.click();
      fixture.whenStable().then(() => {
        expect(caseService.voteCase).toHaveBeenCalledTimes(2);
      });
    });

    it('should show alert with error message on close button if status_id != 1', () => {
      kase.status_id = 2;
      spyOn(window, 'alert');
      fixture.debugElement.nativeElement.querySelector('#revoke').click();

      expect(window.alert).toHaveBeenCalledWith('Отменить можно только заявку, имеющую статус "Не обработано". Если вы действительно хотите отменить текущую заявку, обратитесь по тел. 06.');
    });

    it('should close the case', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(caseService, 'revokeCase').and.returnValue(of({}));
      spyOn(component.removeCase, 'emit');
      spyOn(window, 'alert');
      fixture.debugElement.nativeElement.querySelector('#revoke').click();
      fixture.detectChanges();

      expect(caseService.revokeCase).toHaveBeenCalledWith(kase.case_id);
      expect(component.removeCase.emit).toHaveBeenCalledWith(true);
      expect(window.alert).toHaveBeenCalledWith('Заявка отменена');
    });
  });
});
