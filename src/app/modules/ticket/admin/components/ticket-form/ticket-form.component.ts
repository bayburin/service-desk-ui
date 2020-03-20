import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import { contentBlockAnimation } from '@animations/content.animation';
import { QuestionTicket } from '@modules/ticket/models/question_ticket/question_ticket.model';
import { Answer } from '@modules/ticket/models/answer/answer.model';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.sass'],
  animations: [contentBlockAnimation]
})
export class TicketFormComponent implements OnInit {
  preview = [];
  @Input() ticketForm: FormGroup;
  @Input() ticket: QuestionTicket;
  @Input() submitted: boolean;

  constructor(private formBuilder: FormBuilder) {}

  get form() {
    return this.ticketForm.controls;
  }

  get answers_form() {
    return this.form.answers as FormArray;
  }

  ngOnInit() {
    if (this.ticket) {
      this.ticket.answers.forEach(answer => this.answers_form.push(this.createAnswer(answer)));
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
