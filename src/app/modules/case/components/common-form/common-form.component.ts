import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable, Subject, merge } from 'rxjs';
import { finalize, takeWhile, map, filter } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '@shared/services/user/user.service';
import { UserI } from '@interfaces/user.interface';
import { ItemI } from '@interfaces/item.interface';
import { CaseService } from '@modules/case/services/case/case.service';
import { CaseI } from '@interfaces/case.interface';
import { Service } from '@modules/ticket/models/service.model';

@Component({
  selector: 'app-common-form',
  templateUrl: './common-form.component.html',
  styleUrls: ['./common-form.component.scss']
})
export class CommonFormComponent implements OnInit, OnDestroy {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  @Input() formType: 'new' | 'edit';
  @Output() caseSaved = new EventEmitter();
  caseForm: FormGroup;
  user: UserI;
  loading = {
  params: false,
    form: false
  };
  services: Service[];
  items: ItemI[];
  onService = new Subject<string>();
  submitted = false;
  private alive = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private location: Location,
    private caseService: CaseService
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
    this.loadParameters();
    this.userService.user.subscribe((data: UserI) => this.user = data);
    this.caseForm = this.formBuilder.group({
      id_tn: [this.user.id_tn],
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
      without_item: [false],
    });
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
        .subscribe(
          () => this.caseSaved.emit(),
          error => console.log('Обработать ошибку: ', error)
        );
    } else {

    }
  }

  /**
   * Событие возврата на предыдущую страницу.
   *
   * @param event - объект события.
   */
  onCancel(event: any): void {
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
        },
        error => console.log('Обработать ошибку: ', error)
      );
  }

  /**
   * Получить данные для отправки на сервер.
   */
  private getRawValue(): CaseI {
    return this.caseService.getRowValues(this.caseForm.getRawValue());
  }
}
