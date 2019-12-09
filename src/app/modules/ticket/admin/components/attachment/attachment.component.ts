import { Component, Input, forwardRef, OnChanges, SimpleChanges, SimpleChange, AfterViewInit, Injector, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, FormControl } from '@angular/forms';

import { Answer } from '@modules/ticket/models/answer/answer.model';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AttachmentComponent),
      multi: true
    }
  ]
})
export class AttachmentComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  @Input() answer: Answer;
  @Input() progress: number;
  @Input() loading: boolean;
  file: File;
  message: string;
  control: FormControl;

  constructor(private injector: Injector, private ref: ElementRef) {}

  onChange: any = (val: any) => {};

  onTouched: any = (val: any) => {};

  /**
   * Событие выбора файла
   */
  onChangeAttachment(event): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.onChange(this.file);
      this.ref.nativeElement.querySelector('#attachment').value = '';
    }
  }

  /**
   * Открывает окно для выбора файла.
   */
  chooseFile(): void {
    this.ref.nativeElement.querySelector('#attachment').click();
  }

  /**
   * Записывает новое значение в элемент формы из модели.
   */
  writeValue(value: any): void {
    this.file = null;
  }

  /**
   * Вызывает функцию обратного вызова в случае изменения значения в UI.
   *
   * @param fn - ф-я обратного вызова
   */

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Вызывает функцию обраного вызова, если пользователь затронул компонент.
   *
   * @param fn - ф-я обратного вызова
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);

    if (ngControl) {
      this.control = ngControl.control as FormControl;
      this.control.statusChanges.subscribe(status => {
        this.setMessage();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentProgress: SimpleChange = changes.progress;
    const loading: SimpleChange = changes.loading;

    if (currentProgress && currentProgress.currentValue) {
      this.setMessage(currentProgress.currentValue);
    }
    if (loading && this.control) {
      this.setMessage();
    }
  }

  private setMessage(progress = 0) {
    if (this.control.invalid) {
      this.message = 'Ошибка';
      this.progress = 100;
    } else if (progress === 100 && this.loading) {
      this.message = 'Загрузка...';
    } else if (!this.loading) {
      this.message = 'Готово';
    } else {
      this.message = '';
    }
  }
}
