import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';

import { CommonFormComponent } from './common-form.component';
import { UserService } from '@shared/services/user/user.service';
import { CaseService } from '@modules/case/services/case/case.service';
import { UserI } from '@interfaces/user.interface';
import { ItemI } from '@interfaces/item.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { UserOwnsI } from '@interfaces/user-owns.interface';
import { User } from 'app/core/models/user/user';
import { UserFactory } from 'app/core/factories/user.factory';

const userI = {
  id_tn: 12345,
  tn: 100123,
  fio: 'Форточкина Клавдия Ивановна',
  dept: 714,
  tel: '41-85',
  email: 'test-email'
} as UserI;
const user = UserFactory.create(userI);
const service = ServiceFactory.create({ id: 1, name: 'Тестовый сервис' });
const item = { item_id: 12, invent_num: '333444', type: { short_description: 'Монитор' }, model: { item_model: 'Asus ABC' } } as ItemI;
const userOwns: UserOwnsI = {
  services: [service],
  items: [item]
};

class StubUserService {
  user = new BehaviorSubject<User>(user);

  loadUserOwns() {
    return of(userOwns);
  }
}

class StubCaseService {
  createCase() {
    return of({});
  }

  getRawValues() {}
}

describe('CommonFormComponent', () => {
  let component: CommonFormComponent;
  let fixture: ComponentFixture<CommonFormComponent>;
  let form;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [CommonFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: UserService, useClass: StubUserService },
        { provide: CaseService, useClass: StubCaseService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonFormComponent);
    component = fixture.componentInstance;
    component.formType = 'new';
  });

// Unit ====================================================================================================================================

  it('should load user owns', () => {
    userService = TestBed.get(UserService);
    spyOn(userService, 'loadUserOwns').and.callThrough();
    fixture.detectChanges();

    expect(userService.loadUserOwns).toHaveBeenCalled();
  });

  describe('Unit tests', () => {
    beforeEach(() => {
      fixture.detectChanges();
      form = component.caseForm;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be invalid when form is empty', () => {
      expect(component.caseForm.valid).toBeFalsy();
    });

    it('should set user attirbutes', () => {
      expect(form.controls.id_tn.value).toEqual(user.idTn);
      expect(form.controls.user_tn.value).toEqual(user.tn);
      expect(form.controls.fio.value).toEqual(user.fio);
      expect(form.controls.dept.value).toEqual(user.dept);
      expect(form.controls.email.value).toEqual(user.email);
      expect(form.controls.phone.value).toEqual(user.tel);
    });

    it('should validate service', () => {
      expect(form.controls.service.valid).toBeFalsy();
      expect(form.controls.service.errors.required).toBeTruthy();
    });

    it('should validate description', () => {
      expect(form.controls.desc.valid).toBeFalsy();
      expect(form.controls.desc.errors.required).toBeTruthy();
    });

    it('should validate item', () => {
      expect(form.controls.item.valid).toBeFalsy();
      expect(form.controls.item.errors.required).toBeTruthy();
    });

    it('should be valid when form is filled', () => {
      form.controls.service.setValue(service);
      form.controls.desc.setValue('Описание проблемы');
      form.controls.item.setValue(item);

      expect(form.valid).toBeTruthy();
    });
  });

// Shallow tests ===========================================================================================================================

  describe('Shallow tests', () => {
    it('should show all services', () => {
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('#service').click();
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toContain(service.name);
    });

    it('should show all user items', () => {
      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toContain(item.type['short_description']);
    });

    it('should emit to caseSaved subject if case has been created', inject([Router], (router: Router) => {
      spyOn(component.caseSaved, 'emit');
      fixture.detectChanges();
      form = component.caseForm;
      form.controls.service.setValue(service);
      form.controls.desc.setValue('Здесь описание проблемы');
      form.controls.item.setValue(item);
      fixture.debugElement.nativeElement.querySelector('button[type="submit"]').click();

      expect(component.caseSaved.emit).toHaveBeenCalled();
    }));
  });
});
