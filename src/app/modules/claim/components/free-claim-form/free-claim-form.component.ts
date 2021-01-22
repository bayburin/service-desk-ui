import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable, Subject, merge } from 'rxjs';
import { finalize, takeWhile, map, filter } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '@shared/services/user/user.service';
import { ItemI } from '@interfaces/item.interface';
import { ClaimService } from '@modules/claim/services/claim/claim.service';
import { ClaimI } from '@interfaces/claim.interface';
import { Service } from '@modules/ticket/models/service/service.model';
import { User } from '@shared/models/user/user.model';

@Component({
  selector: 'app-free-claim-form',
  templateUrl: './free-claim-form.component.html',
  styleUrls: ['./free-claim-form.component.scss']
})
export class FreeClaimFormComponent implements OnInit, OnDestroy {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  @ViewChild('fileView', { static: true }) fileView: ElementRef;
  @Input() formType: 'new' | 'edit';
  @Output() claimSaved = new EventEmitter();
  claimForm: FormGroup;
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
    private claimService: ClaimService,
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  get form() {
    return this.claimForm.controls;
  }

  get formItem() {
    return this.claimForm.controls.item as FormControl;
  }

  get formService() {
    return this.claimForm.controls.service as FormControl;
  }

  ngOnInit() {
    this.queryParams = this.route.snapshot.queryParams;
    this.userService.user.subscribe((user: User) => this.user = user);
    this.claimForm = this.formBuilder.group({
      id_tn: [this.user.idTn],
      user_tn: [{ value: this.user.tn, disabled: true }],
      fio: [{ value: this.user.fio, disabled: true }],
      dept: [{ value: this.user.dept, disabled: true }],
      email: [this.user.email],
      phone: [this.user.tel],
      mobile: [''],
      service: ['', Validators.required],
      desc: [this.queryParams.desc || '', Validators.required],
      without_service: [this.queryParams.without_service || false],
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
    if (this.claimForm.invalid) {
      return;
    }

    this.loading.form = true;
    if (this.formType === 'new') {
      this.claimService.create(this.getRawValue())
        .pipe(finalize(() => this.loading.form = false))
        .subscribe(() => this.claimSaved.emit());
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
  private getRawValue(): ClaimI {
    return this.claimService.getRawValues(this.claimForm.getRawValue());
  }

  /**
   * Установить в поля значения по умолчанию, полученные из адресной строки.
   */
  private setDefaultValues() {
    const service = this.services.find(el => el.name.toLowerCase().includes(this.queryParams.service.toLowerCase()));

    this.form.service.setValue(service);
    if (this.queryParams.without_item) {
      this.onSelectCheckbox(this.formItem);
    }
    if (this.queryParams.without_service) {
      this.onSelectCheckbox(this.formService);
    }
  }
}
