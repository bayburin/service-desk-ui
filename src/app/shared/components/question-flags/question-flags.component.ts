import { Component, Input } from '@angular/core';
import { Question } from '@modules/ticket/models/question/question.model';

@Component({
  selector: 'app-question-flags',
  templateUrl: './question-flags.component.html',
  styleUrls: ['./question-flags.component.sass']
})
export class QuestionFlagsComponent {
  @Input() question: Question;

  constructor() {}
}
