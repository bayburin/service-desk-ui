import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable, Subject, merge } from 'rxjs';
import { finalize, takeWhile, map, filter } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '@shared/services/user/user.service';
import { ItemI } from '@interfaces/item.interface';
import { CaseService } from '@modules/case/services/case/case.service';
import { CaseI } from '@interfaces/case.interface';
import { Service } from '@modules/ticket/models/service/service.model';
import { User } from '@shared/models/user/user.model';

@Component({
  selector: 'app-common-form',
  templateUrl: './common-form.component.html',
  styleUrls: ['./common-form.component.scss']
})
export class CommonFormComponent implements OnInit, OnDestroy {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  @ViewChild('fileView', { static: true }) fileView: ElementRef;
  @Input() formType: 'new' | 'edit';
  @Output() caseSaved = new EventEmitter();
  caseForm: FormGroup;
  user: User;
  loading = {
  params: false,
    form: false
  };
  services: Service[];
  items: ItemI[];
  onService = new Subject<string>();
  submitted = false;
  private alive = true;
  private queryParams: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private location: Location,
    private caseService: CaseService,
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  get form() {
    return this.caseForm.controls;
  }

  get formItem() {
    return this.caseForm.controls.item as FormControl;
  }

  get formService() {
    return this.caseForm.controls.service as FormControl;
  }

  ngOnInit() {
    this.queryParams = this.route.snapshot.queryParams;
    this.userService.user.subscribe((user: User) => this.user = user);
    this.caseForm = this.formBuilder.group({
      id_tn: [this.user.idTn],
      user_tn: [{ value: this.user.tn, disabled: true }],
      fio: [{ value: this.user.fio, disabled: true }],
      dept: [{ value: this.user.dept, disabled: true }],
      email: [this.user.email],
      phone: [this.user.tel],
      mobile: [''],
      service: ['', Validators.required],
      desc: ['', Validators.required],
      without_service: [false],
      item: ['', Validators.required],
      without_item: [this.queryParams.without_item || false],
      files: [[]],
      additional: [{ comment: this.queryParams.comment } || '']
    });
    this.loadParameters();
  }

  /**
   * Выбор услуги.
   */
  search = (searchTerm: Observable<string>) => {
    const focusWithClosedPopup = this.onService.pipe(filter(() => !this.instance.isPopupOpen()));

    return merge(searchTerm, focusWithClosedPopup).pipe(
      takeWhile(() => this.alive),
      map((term) => term === '' ? this.services : this.services.filter((s) => s.name.toLowerCase().indexOf(term.toLowerCase()) > -1))
    );
  }

  /**
   * Формат вывода услуги.
   */
  formatter = (val: { name: string }) => val.name;

  /**
   * Событие нажатия на checkbox, говорящее о том, что данные в списке отсутствуют.
   *
   * @param control - formControl, который будет отключен/активирован.
   */
  onSelectCheckbox(control: FormControl): void {
    if (control.disabled) {
      control.enable();
      control.setValidators([Validators.required]);
      control.updateValueAndValidity();
    } else {
      control.disable();
      control.setValidators(null);
    }
  }

  /**
   * Преобразует загружаемый файл в base64.
   *
   * @param fileInput - событие выбора файла.
   */
  convertToBase64(fileInput: any) {
    const filenames = [];

    for (const file of fileInput.target.files) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const currentFiles = this.form.files.value.slice();

        currentFiles.push({ filename: file.name, file: reader.result });
        filenames.push(file.name);
        this.form.files.setValue(currentFiles);
        this.renderer.setProperty(this.fileView.nativeElement, 'value', filenames.join('; '));
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Событие отправки формы.
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.caseForm.invalid) {
      return;
    }

    this.loading.form = true;
    if (this.formType === 'new') {
      this.caseService.createCase(this.getRawValue())
        .pipe(finalize(() => this.loading.form = false))
        .subscribe(() => this.caseSaved.emit());
    } else {

    }
  }

  /**
   * Событие возврата на предыдущую страницу.
   *
   * @param event - объект события.
   */
  onCancel(event: Event): void {
    event.preventDefault();
    this.location.back();
  }

  trackByItem(index, item: ItemI) {
    return item.item_id;
  }

  ngOnDestroy() {
    this.alive = false;
  }

  /**
   * Загрузка параметров, необходимых для заявки, с сервера.
   */
  private loadParameters(): void {
    this.loading.params = true;
    this.userService.loadUserOwns()
      .pipe(finalize(() => this.loading.params = false))
      .subscribe(
        data => {
          this.services = data.services;
          this.items = data.items;
          this.setDefaultValues();
        });
  }

  /**
   * Получить данные для отправки на сервер.
   */
  private getRawValue(): CaseI {
    return this.caseService.getRawValues(this.caseForm.getRawValue());
  }

  /**
   * Установить в поля значения по умолчанию, полученные из адресной строки.
   */
  private setDefaultValues() {
    const service = this.services.find(el => el.name === this.queryParams.service);

    this.form.service.setValue(service);
    if (this.queryParams.without_item) {
      this.onSelectCheckbox(this.formItem);
    }
  }
}
