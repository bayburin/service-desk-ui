import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.question.correction) {
      this.showCorrection();
    }
  }

  /**
   * "Раскрывает" вопрос.
   */
  toggleQuestion(): void {
    this.question.open = !this.question.open;
  }

  trackByAnswer(index, answer: AnswerI) {
    return answer.id;
  }

  /**
   * Перейти по адресу редактирования вопроса.
   */
  editQuestion(): void {
    this.router.navigate([this.question.id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Показать исправления.
   */
  showCorrection() {
    this.question = this.question.correction;
  }

  /**
   * Показать оригинал.
   */
  showOriginal() {
    this.question = this.question.original;
  }
}
