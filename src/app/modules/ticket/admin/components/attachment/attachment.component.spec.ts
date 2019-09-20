import { FormsModule, FormControl } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular//core';

import { AttachmentComponent } from './attachment.component';

describe('AttachmentComponent', () => {
  let component: AttachmentComponent;
  let fixture: ComponentFixture<AttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AttachmentComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentComponent);
    component = fixture.componentInstance;
    component.control = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set null to "file" attribute', () => {
    component.writeValue('val');

    expect(component.file).toBeNull();
  });

  describe('Upload progress' , () => {
    it('should set message "Загрузка..." if progress is equal 100', () => {
      component.ngOnChanges({
        progress: new SimpleChange(null, 100, true)
      });
      fixture.detectChanges();

      expect(component.message).toEqual('Загрузка...');
    });

    it('should set message "Ошибка" if formcontrol is invalid', () => {
      component.control.setErrors({});
      component.ngOnChanges({
        progress: new SimpleChange(null, 100, true)
      });
      fixture.detectChanges();

      expect(component.message).toEqual('Ошибка');
    });

    it('should set message empty message in another cases', () => {
      component.ngOnChanges({
        progress: new SimpleChange(null, 90, true)
      });
      fixture.detectChanges();

      expect(component.message).toEqual('');
    });
  });
});
