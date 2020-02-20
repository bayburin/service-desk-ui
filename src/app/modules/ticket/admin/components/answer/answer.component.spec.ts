import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NO_ERRORS_SCHEMA, Component, forwardRef } from '@angular/core';
import { of, throwError } from 'rxjs';

import { AnswerComponent } from './answer.component';
import { Answer } from '@modules/ticket/models/answer/answer.model';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';
import { AttachmentService } from '@shared/services/attachment/attachment.service';
import { StubAttachmentService } from '@shared/services/attachment/attachment.service.stub';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AnswerFactory } from '@modules/ticket/factories/answer.factory';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-attachment',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StubAttachmentComponent),
      multi: true
    }
  ]
})
class StubAttachmentComponent implements ControlValueAccessor {
  writeValue(value: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}

describe('AnswerComponent', () => {
  let component: AnswerComponent;
  let fixture: ComponentFixture<AnswerComponent>;
  let answer: Answer;
  let attachmentService: AttachmentService;
  let attachment: AnswerAttachmentI;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [AnswerComponent, StubAttachmentComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: AttachmentService, useClass: StubAttachmentService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerComponent);
    component = fixture.componentInstance;
    attachmentService = TestBed.get(AttachmentService);
    attachment = { id: 2, answer_id: 2, filename: 'file 1.txt' };
    answer = AnswerFactory.create({
      id: 1,
      ticket_id: 2,
      answer: 'Тестовый ответ',
      attachments: [
        attachment,
        { id: 3, answer_id: 2, filename: 'file 2.txt' }
      ]
    });
    component.answer = answer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

// Unit ====================================================================================================================================

  it('should be invalid when form is empty', () => {
    expect(component.uploadForm.valid).toBeFalsy();
  });

  it('should set "answer_id" attribute of form', () => {
    expect(component.form.answer_id.value).toEqual(answer.id);
  });

  it('should validate "answer_id" attribute of form', () => {
    component.form.answer_id.setValue(null);

    expect(component.form.answer_id.valid).toBeFalsy();
    expect(component.form.answer_id.errors.required).toBeTruthy();
  });

  it('should validate "document" attribute of form', () => {
    expect(component.form.document.valid).toBeFalsy();
    expect(component.form.document.errors.required).toBeTruthy();
  });

  describe('upload form', () => {
    let file: Blob;
    beforeEach(() => {
      file = new Blob(['test'], { type: 'application/json' });
    });

    it('should upload form to server if any attribute was changed', () => {
      spyOn(attachmentService, 'uploadAttachment').and.returnValue(of({}));
      component.form.document.setValue(file);

      expect(attachmentService.uploadAttachment).toHaveBeenCalledWith(component.uploadForm.getRawValue());
    });

    it('should not upload form if form invalid', () => {
      spyOn(attachmentService, 'uploadAttachment');
      component.form.answer_id.setValue(123);

      expect(attachmentService.uploadAttachment).not.toHaveBeenCalled();
    });

    it('should set error message received from server to "document" attribute of form', () => {
      const errors = ['error_1', 'error_2'];
      const httpResponse = new HttpErrorResponse({ error: { document: errors }, status: 422 });
      spyOn(attachmentService, 'uploadAttachment').and.callFake(() => {
        return throwError(httpResponse);
      });
      component.form.document.setValue(file);

      expect(component.form.document.errors.serverError).toEqual(errors);
    });

    it('should add uploaded attachment to answer', () => {
      const newAttachment = { id: 23, answer_id: answer.id, filename: 'Новый файл' };
      spyOn(attachmentService, 'uploadAttachment').and.returnValue(of(new HttpResponse({ body: newAttachment })));
      component.form.document.setValue(file);

      expect(answer.attachments.find(el => el === newAttachment)).toBeTruthy();
    });
  });

  describe('#downloadAttachment', () => {
    it('should call "downloadAttachment" method for AttachmentService', () => {
      spyOn(attachmentService, 'downloadAttachment').and.returnValue(of(new Blob()));
      component.downloadAttachment(attachment);

      expect(attachmentService.downloadAttachment).toHaveBeenCalledWith(attachment);
    });
  });

  describe('#removeAttachment', () => {
    beforeEach(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(attachmentService, 'removeAttachment').and.returnValue(of(attachment));
      component.removeAttachment(attachment);
    });

    it('should call "removeAttachment" method for AttachmentService', () => {
      expect(attachmentService.removeAttachment).toHaveBeenCalledWith(attachment);
    });

    it('should remove attachment from answer', () => {
      expect(answer.attachments.find(el => el === attachment)).toBeFalsy();
    });
  });

// Shallow tests ===========================================================================================================================

  it('should show markdown answer', () => {
    // expect(fixture.debugElement.nativeElement.textContent).toContain(answer.answer);
    expect(fixture.debugElement.query(By.css('markdown'))).toBeTruthy();
  });

  it('should create form with app-attachment component', () => {
    expect(fixture.debugElement.nativeElement.querySelector('form > app-attachment')).toBeTruthy();
  });

  it('should show all attachments', () => {
    answer.attachments.forEach(el => {
      expect(fixture.debugElement.nativeElement.textContent).toContain(el.filename);
    });
  });
});
