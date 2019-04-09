import { Component, OnInit, OnDestroy, Inject, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable, Subject, merge } from 'rxjs';
import { finalize, takeWhile, map, filter } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '@shared/services/user/user.service';
import { UserI } from '@models/user.interface';
import { UserOwnsI } from '@models/user-owns.interface';
import { ServiceI } from '@models/service.interface';
import { ItemI } from '@models/item.interface';
import { CaseService } from '@modules/case/services/case/case.service';

@Component({
  selector: 'app-common-form',
  templateUrl: './common-form.component.html',
  styleUrls: ['./common-form.component.scss']
})
export class CommonFormComponent implements OnInit, OnDestroy {
  @ViewChild('instance') instance: NgbTypeahead;
  @Input() formType: 'new' | 'edit';
  @Output() caseSaved = new EventEmitter();
  public caseForm: FormGroup;
  public user: UserI;
  public loading = {
    params: false,
    form: false
  };
  public services: ServiceI[];
  public items: ItemI[];
  public onService = new Subject<string>();
  public submitted = false;
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
      this.caseService.createCase(this.caseForm.getRawValue())
        .pipe(finalize(() => this.loading.form = false))
        .subscribe(
          (data) => {
            console.log('created: ', data);
            this.caseSaved.emit();
          },
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
        (data: UserOwnsI) => {
          this.services = data.services;
          this.items = data.items;
        },
        error => console.log('Обработать ошибку: ', error)
      );
  }
}
