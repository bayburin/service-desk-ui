import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ClaimFormFormComponent } from './claim-form-form.component';

describe('ClaimFormFormComponent', () => {
  let component: ClaimFormFormComponent;
  let fixture: ComponentFixture<ClaimFormFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule, ReactiveFormsModule],
      declarations: [ClaimFormFormComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const formBuilder = TestBed.get(FormBuilder);

    fixture = TestBed.createComponent(ClaimFormFormComponent);
    component = fixture.componentInstance;

    component.claimFormForm = formBuilder.group({
      id: [],
      description: [],
      destination: [],
      message: [],
      info: [],
      groups: formBuilder.array([])
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#addGroup', () => {
    it('should add new group to form', () => {
      component.addGroup();

      expect(component.groupsForm.length).toEqual(1);
    });
  });
});
