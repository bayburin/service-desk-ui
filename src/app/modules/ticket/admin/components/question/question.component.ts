import { Component, OnInit, Input } from '@angular/core';

import { toggleAnswer } from '@modules/ticket/animations/toggle-answer.animation';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { AnswerI } from '@interfaces/answer.interface';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.sass'],
  animations: [toggleAnswer]
})
export class QuestionComponent implements OnInit {
  @Input() question: Ticket;

  constructor() { }

  ngOnInit() {}

  /**
   * "Раскрывает" вопрос.
   */
  toggleQuestion(): void {
    this.question.open = !this.question.open;
  }

  trackByAnswer(index, answer: AnswerI) {
    return answer.id;
  }
}
