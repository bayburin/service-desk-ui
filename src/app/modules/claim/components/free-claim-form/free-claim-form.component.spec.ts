import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FreeClaimFormComponent } from './free-claim-form.component';
import { UserService } from '@shared/services/user/user.service';
import { ClaimService } from '@modules/claim/services/claim/claim.service';
import { ItemI } from '@interfaces/item.interface';
import { ServiceFactory } from '@modules/ticket/factories/service.factory';
import { UserOwnsI } from '@interfaces/user-owns.interface';
import { StubUserService, user } from '@shared/services/user/user.service.stub';
import { StubClaimService } from '@modules/claim/services/claim/claim.service.stub';

const service = ServiceFactory.create({ id: 1, name: 'Тестовый сервис' });
const item = { item_id: 12, invent_num: '333444', type: { short_description: 'Монитор' }, model: { item_model: 'Asus ABC' } } as ItemI;
const userOwns: UserOwnsI = {
  services: [service],
  items: [item]
};
const comment = 'test data';
const additional = { comment };
const desc = 'test description';

describe('FreeClaimFormComponent', () => {
  let component: FreeClaimFormComponent;
  let fixture: ComponentFixture<FreeClaimFormComponent>;
  let form;
  let userService: UserService;
  const stubRoute = jasmine.createSpyObj<ActivatedRoute>('ActivatedRoute', ['snapshot']);
  const stubRouteProxy = new Proxy(stubRoute, {
    get(target, prop) {
      if (prop === 'snapshot') {
        return {
          queryParams: {
            service: service.name,
            without_item: true,
            desc,
            comment
          }
        };
      }
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [FreeClaimFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: UserService, useClass: StubUserService },
        { provide: ClaimService, useClass: StubClaimService },
        { provide: ActivatedRoute, useValue: stubRouteProxy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeClaimFormComponent);
    component = fixture.componentInstance;
    component.formType = 'new';
    userService = TestBed.get(UserService);
    spyOn(userService, 'loadUserOwns').and.returnValue(of(userOwns));
  });

// Unit ====================================================================================================================================

  it('should load user owns', () => {
    fixture.detectChanges();

    expect(userService.loadUserOwns).toHaveBeenCalled();
  });

  describe('Unit tests', () => {
    beforeEach(() => {
      fixture.detectChanges();
      form = component.claimForm;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be invalid when form is empty', () => {
      form.controls.desc.setValue('');

      expect(form.valid).toBeFalsy();
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
      form.controls.service.setValue('');

      expect(form.controls.service.valid).toBeFalsy();
      expect(form.controls.service.errors.required).toBeTruthy();
    });

    it('should validate description', () => {
      form.controls.desc.setValue('');

      expect(form.controls.desc.valid).toBeFalsy();
      expect(form.controls.desc.errors.required).toBeTruthy();
    });

    it('should validate item', () => {
      component.onSelectCheckbox(component.formItem);

      expect(form.controls.item.valid).toBeFalsy();
      expect(form.controls.item.errors.required).toBeTruthy();
    });

    it('should be valid when form is filled', () => {
      form.controls.service.setValue(service);
      form.controls.desc.setValue('Описание проблемы');
      form.controls.item.setValue(item);

      expect(form.valid).toBeTruthy();
    });

    it('should set default values when queryParams exists', async(() => {
      expect(form.controls.without_item.value).toEqual(true);
      expect(form.controls.service.value).toEqual(service);
      expect(form.controls.additional.value).toEqual(additional);
    }));
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

    it('should emit to claimSaved subject if claim has been created', inject([Router], (router: Router) => {
      spyOn(component.claimSaved, 'emit');
      fixture.detectChanges();
      component.form.service.setValue(service);
      component.form.desc.setValue('Здесь описание проблемы');
      component.form.item.setValue(item);
      fixture.debugElement.nativeElement.querySelector('button[type="submit"]').click();

      expect(component.claimSaved.emit).toHaveBeenCalled();
    }));
  });
});
