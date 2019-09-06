import { Observable, Subject, concat, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, tap, finalize, filter } from 'rxjs/operators';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { TagI } from '@interfaces/tag.interface';
import { contentBlockAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.sass'],
  animations: [contentBlockAnimation]
})
export class NewTicketComponent implements OnInit {
  submitted = false;
  modal: NgbModalRef;
  service: Service;
  ticketForm: FormGroup;
  tags: Observable<TagI[]>;
  tagInput = new Subject<string>();
  serviceTags: string[];
  loading = {
    tags: false,
    form: false,
    serviceTags: false
  };
  @ViewChild('content', { static: true }) content: ElementRef;
  @Output() ticketSaved = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private ticketService: TicketService
  ) {}

  get form() {
    return this.ticketForm.controls;
  }

  ngOnInit() {
    this.service = this.serviceService.service;
    this.loadTags();
    this.openModal();
    this.buildForm();
    this.loadServiceTags();
  }

  /**
   * Добавляет шаблон ответа к вопросу.
   */
  addAnswer() {
    (this.form.answers_attributes as FormArray).push(this.createAnswer());
  }

  /**
   * Сохраняет вопрос.
   */
  save() {
    this.submitted = true;
    if (this.ticketForm.invalid) {
      return;
    }

    this.loading.form = true;
    this.ticketService.createTicket(this.ticketForm.getRawValue())
      .pipe(finalize(() => this.loading.form = false))
      .subscribe(
        () => {
          this.modal.close();
          this.redirectToService();
          this.ticketSaved.emit();
        },
        error => console.log(error)
      );
  }

  /**
   * Возвращается к маршруту на уровень выше.
   */
  cancel() {
    this.modal.dismiss();
    this.redirectToService();
  }

  /**
   * Переключает состояние "is_hidden" у указанного объекта.
   *
   * @param object - изменяемый объект
   */
  toggleHidden(object: FormGroup) {
    const currentValue = object.controls.is_hidden.value;

    object.controls.is_hidden.setValue(!currentValue);
  }

  /**
   * Удаляет ответ.
   *
   * @param answer - ответ
   */
  deleteAnswer(answer: FormGroup) {
    const index = (this.form.answers_attributes as FormArray).controls.indexOf(answer);
    (this.form.answers_attributes as FormArray).removeAt(index);
  }

  private loadTags() {
    this.tags = concat(
      of([]),
      this.tagInput.pipe(
        filter(term => term && term.length >= 2),
        tap(() => this.loading.tags = true),
        switchMap(term => {
          return this.ticketService.loadTags(term)
            .pipe(finalize(() => this.loading.tags = false));
        })
      )
    );
  }

  private loadServiceTags() {
    this.loading.serviceTags = true;
    this.serviceService.loadTags()
      .pipe(finalize(() => this.loading.serviceTags = false))
      .subscribe((tags: TagI[]) => {
        this.serviceTags = tags.map(tag => `<span class="badge badge-secondary">${tag.name}</span>`);
      });
  }

  private openModal() {
    this.modal = this.modalService.open(
      this.content,
      {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        windowClass: 'modal-holder'
      }
    );
  }

  private buildForm() {
    this.ticketForm = this.formBuilder.group({
      service_id: [this.service.id],
      name: ['', Validators.required],
      ticket_type: ['question'],
      is_hidden: [true],
      sla: [null],
      to_approve: [false],
      popularity: [0],
      tags_attributes: [[]],
      answers_attributes: this.formBuilder.array([this.createAnswer()])
    });
  }

  private createAnswer() {
    return this.formBuilder.group({
      answer: ['', Validators.required],
      link: [''],
      is_hidden: [true]
    });
  }

  private redirectToService() {
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }
}
