import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Subscription, of } from 'rxjs';
import { catchError, tap, takeWhile, switchMap, finalize, filter } from 'rxjs/operators';

import { AnswerI } from '@interfaces/answer.interface';
import { AttachmentService } from '@shared/services/attachment/attachment.service';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.sass']
})
export class AnswerComponent implements OnInit, OnDestroy {
  @Input() answer: AnswerI;
  uploadForm: FormGroup;
  progress = 0;
  loadForm: Subscription;
  loading = false;
  private alive = true;

  constructor(private formBuilder: FormBuilder, private attachmentService: AttachmentService) { }

  get form() {
    return this.uploadForm.controls;
  }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      answer_id: [this.answer.id, Validators.required],
      document: [null, Validators.required]
    });

    this.uploadForm.valueChanges
      .pipe(
        takeWhile(() => this.alive),
        filter(() => this.uploadForm.valid),
        tap(() => this.loading = true),
        switchMap(() => {
          return this.attachmentService.uploadAttachment(this.uploadForm.getRawValue())
            .pipe(
              catchError(error => {
                this.handleServerErrors(error);

                return of({});
              }),
              finalize(() => this.loading = false)
            );
        }),
      )
      .subscribe(
        data => {
          if (data.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * data.loaded) / data.total);
          }
        },
      );
  }

  /**
   * Загружает выбранный файл.
   *
   * @param attachment - объект, содержащий имя файла
   */
  downloadAttachment(attachment: AnswerAttachmentI): void {
    attachment.loading = true;
    this.attachmentService.downloadAttachment(attachment)
      .pipe(finalize(() => attachment.loading = false))
      .subscribe(
        fileData => {
          const url = window.URL.createObjectURL(fileData);
          const link = document.createElement('a');

          link.href = url;
          link.download = attachment.filename;
          link.click();

          // Для firefox необходимо отложить отзыв ObjectURL.
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            link.remove();
          }, 100);
        });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private handleServerErrors(error: HttpErrorResponse): void {
    if (error.status !== 422) {
      return;
    }

    const data = error.error;
    const fields = Object.keys(data || {});

    fields.forEach(field => {
      const control = this.uploadForm.get(field);

      control.setErrors({ serverError: data[field] });
    });
  }
}
