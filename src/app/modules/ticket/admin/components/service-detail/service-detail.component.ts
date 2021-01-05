import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';

import { toggleAnswer } from '@modules/ticket/animations/toggle-answer.animation';
import { Service } from '@modules/ticket/models/service/service.model';
import { contentBlockAnimation } from '@animations/content.animation';
import { QuestionComponent } from '../question/question.component';
import { Question } from '@modules/ticket/models/question/question.model';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.sass'],
  animations: [contentBlockAnimation, toggleAnswer]
})
export class ServiceDetailComponent implements OnInit {
  toggleFilters = false;
  showOnlyMyQuestions = localStorage.getItem('showOnlyMyQuestions') === 'true';
  @Input() service: Service;
  @ViewChildren(QuestionComponent) questionTemplateComponent: QueryList<QuestionComponent>;

  constructor() { }

  ngOnInit() { }

  trackByQuestion(index, question: Question) {
    return question.correction ? question.correction : question;
  }

  toggleshowOnlyMyQuestions(): void {
    this.showOnlyMyQuestions = !this.showOnlyMyQuestions;
    localStorage.setItem('showOnlyMyQuestions', `${this.showOnlyMyQuestions}`);
  }
}
