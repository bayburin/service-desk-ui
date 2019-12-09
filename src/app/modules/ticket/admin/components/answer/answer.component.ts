import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpEventType, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription, of } from 'rxjs';
import { catchError, tap, takeWhile, switchMap, finalize, filter } from 'rxjs/operators';

import { Answer } from '@modules/ticket/models/answer/answer.model';
import { AttachmentService } from '@shared/services/attachment/attachment.service';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';
import { fileNameLength } from '@shared/validators/file-name-length.validator';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.sass']
})
export class AnswerComponent implements OnInit, OnDestroy {
  @Input() answer: Answer;
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
      document: [null, [Validators.required, fileNameLength()]]
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
          } else if (data instanceof HttpResponse) {
            this.answer.addAttachment(data.body);
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
    attachment.loadingDownload = true;
    this.attachmentService.downloadAttachment(attachment)
      .pipe(finalize(() => attachment.loadingDownload = false))
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

  /**
   * Удаляет указанный файл.
   *
   * @param attachment - объект, содержащий имя файла.
   */
  removeAttachment(attachment: AnswerAttachmentI): void {
    if (!confirm(`Вы действительно хотите удалить файл ${attachment.filename}?`)) {
      return;
    }

    attachment.loadingRemove = true;
    this.attachmentService.removeAttachment(attachment)
      .pipe(finalize(() => attachment.loadingRemove = false))
      .subscribe(() => this.answer.removeAttachment(attachment));
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
