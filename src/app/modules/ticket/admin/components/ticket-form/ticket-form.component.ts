import { filter, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable, of, Subject, concat } from 'rxjs';

import { TagI } from '@interfaces/tag.interface';
import { ServiceService } from '@shared/services/service/service.service';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { contentBlockAnimation } from '@animations/content.animation';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { Answer } from '@modules/ticket/models/answer/answer.model';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.sass'],
  animations: [contentBlockAnimation]
})
export class TicketFormComponent implements OnInit {
  loading = {
    tags: false,
    serviceTags: false
  };
  tags: Observable<TagI[]>;
  tagInput = new Subject<string>();
  serviceTags: { data: TagI, htmlString: string }[];
  @Input() parentForm: FormGroup;
  @Input() ticket: Ticket;

  constructor(
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private ticketService: TicketService
  ) {}

  get form() {
    return this.parentForm.controls;
  }

  ngOnInit() {
    this.loadTags();
    this.loadServiceTags();

    if (this.ticket) {
      this.ticket.answers.forEach(answer => (this.form.answers as FormArray).push(this.createAnswer(answer)));
    }
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
      answer.controls._destroy.setValue(true);

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

  trackByServiceTag(index, serviceTag: any) {
    return serviceTag.data.id;
  }

  private loadServiceTags(): void {
    this.loading.serviceTags = true;
    this.serviceService.loadTags()
      .pipe(finalize(() => this.loading.serviceTags = false))
      .subscribe((tags: TagI[]) => {
        this.serviceTags = tags.map(tag => {
          if (this.ticket) {
            tag.selected = this.ticket.tags.some(ticketTag => ticketTag.id === tag.id);
          }

          return {
            data: tag,
            htmlString: `<span class="badge badge-secondary">${tag.name}</span>`
          };
        });
      });
  }

  private loadTags(): void {
    this.tags = concat(
      of([]),
      this.tagInput.pipe(
        filter(term => term && term.length >= 2),
        debounceTime(300),
        tap(() => this.loading.tags = true),
        switchMap(term => this.ticketService.loadTags(term).pipe(finalize(() => this.loading.tags = false)))
      )
    );
  }

  private createAnswer(answer: Answer = {} as Answer): FormGroup {
    return this.formBuilder.group({
      id: [answer.id],
      ticket_id: [answer.ticketId],
      reason: [answer.reason],
      answer: [answer.answer, Validators.required],
      link: [answer.link],
      is_hidden: [answer.isHidden || false],
      _destroy: [false]
    });
  }
}
