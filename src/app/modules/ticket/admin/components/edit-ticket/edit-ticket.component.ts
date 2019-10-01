import { AnswerI } from '@interfaces/answer.interface';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, of, concat } from 'rxjs';
import { filter, finalize, switchMap, tap, debounceTime, map } from 'rxjs/operators';

import { TicketService } from '@shared/services/ticket/ticket.service';
import { ServiceService } from '@shared/services/service/service.service';
import { TagI } from '@interfaces/tag.interface';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { contentBlockAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.sass'],
  animations: [contentBlockAnimation]
})
export class EditTicketComponent implements OnInit {
  submitted = false;
  modal: NgbModalRef;
  service: Service;
  ticket: Ticket;
  ticketForm: FormGroup;
  tags: Observable<TagI[]>;
  tagInput = new Subject<string>();
  serviceTags: { data: TagI, htmlString: string }[];
  loading = {
    tags: false,
    form: false,
    serviceTags: false
  };
  @ViewChild('content', { static: true }) content: ElementRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private ticketService: TicketService
  ) { }

  get form() {
    return this.ticketForm.controls;
  }

  ngOnInit() {
    this.service = this.serviceService.service;
    this.route.data.subscribe(data => {
      this.ticket = data.ticket;
      this.buildForm();
      this.openModal();
      console.log('Edit ticket ', this.ticket);
    });
    this.loadTags();
    this.loadServiceTags();
  }

  /**
   * Сохраняет вопрос.
   */
  save(event: Event): void {
    event.stopPropagation();
    this.submitted = true;
    if (this.ticketForm.invalid) {
      return;
    }

    this.loading.form = true;
    this.ticketService.updateTicket(this.ticket, this.ticketForm.getRawValue())
      .pipe(finalize(() => this.loading.form = false))
      .subscribe(
        (data) => {
          console.log('success! ', data);
          this.modal.close();
          this.redirectToService();
        },
        error => console.log(error)
      );
  }

  /**
   * Возвращается к маршруту на уровень выше.
   */
  cancel(event: Event): void {
    event.stopPropagation();
    this.modal.dismiss();
    this.redirectToService();
  }

  /**
   * Переключает состояние "is_hidden" у указанного объекта.
   *
   * @param object - изменяемый объект
   */
  toggleHidden(object: FormGroup): void {
    const currentValue = object.controls.is_hidden.value;

    object.controls.is_hidden.setValue(!currentValue);
  }

  /**
   * Добавляет шаблон ответа к вопросу.
   */
  addAnswer(): void {
    (this.form.answers as FormArray).push(this.createAnswer());
  }

  /**
   * Удаляет ответ.
   *
   * @param answer - ответ
   */
  deleteAnswer(answer: FormGroup): void {
    if (answer.value.id) {
      console.log('here');
      answer.controls._destroy.setValue(true);
      console.log(answer);

      return;
    }

    const index = (this.form.answers as FormArray).controls.indexOf(answer);
    (this.form.answers as FormArray).removeAt(index);
  }

  /**
   * Добавляет тег к вопросу.
   *
   * @params tag - тег
   */
  addTag(tag: TagI): void {
    const tags: TagI[] = this.form.tags.value.slice();

    if (!tags.some(el => el.name === tag.name)) {
      tag.selected = true;
      tags.push(tag);
      this.form.tags.setValue(tags);
    }
  }

  /**
   * Спрятать тег в списке.
   *
   * @params tag - тег
   */
  hideTag(tag: TagI): void {
    const serviceTag = this.serviceTags.find(el => el.data.name === tag.name);

    if (serviceTag) {
      serviceTag.data.selected = true;
    }
  }

  /**
   * Показать тег в списке.
   *
   * @param data -данные, содержащие тег в поле value
   */
  showTag(data: any): void {
    const serviceTag = this.serviceTags.find(el => el.data.name === data.value.name);

    if (serviceTag) {
      serviceTag.data.selected = false;
    }
  }


  private loadTags(): void {
    this.tags = concat(
      of([]),
      this.tagInput.pipe(
        filter(term => term && term.length >= 2),
        debounceTime(300),
        tap(() => this.loading.tags = true),
        switchMap(term => {
          return this.ticketService.loadTags(term)
            .pipe(finalize(() => this.loading.tags = false));
        })
      )
    );
  }

  private loadServiceTags(): void {
    this.loading.serviceTags = true;
    this.serviceService.loadTags()
      .pipe(finalize(() => this.loading.serviceTags = false))
      .subscribe((tags: TagI[]) => {
        this.serviceTags = tags.map(tag => {
          tag.selected = this.ticket.tags.some(ticketTag => ticketTag.id === tag.id);

          return {
            data: tag,
            htmlString: `<span class="badge badge-secondary">${tag.name}</span>`
          };
        });
      });
  }

  private openModal(): void {
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

  private buildForm(): void {
    this.ticketForm = this.formBuilder.group({
      id: [this.ticket.id],
      service_id: [this.ticket.serviceId],
      name: [this.ticket.name, Validators.required],
      ticket_type: [this.ticket.ticketType],
      is_hidden: [this.ticket.isHidden],
      sla: [this.ticket.sla],
      to_approve: [this.ticket.toApprove],
      popularity: [this.ticket.popularity],
      tags: [this.ticket.tags],
      answers: this.formBuilder.array([])
    });

    this.ticket.answers.forEach(answer => (this.form.answers as FormArray).push(this.createAnswer(answer)));
  }

  private createAnswer(answer: AnswerI = {} as AnswerI): FormGroup {
    return this.formBuilder.group({
      id: [answer.id],
      ticket_id: [answer.ticket_id],
      reason: [answer.reason],
      answer: [answer.answer, Validators.required],
      link: [answer.link],
      is_hidden: [answer.is_hidden],
      _destroy: [false]
    });
  }

  private redirectToService(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
