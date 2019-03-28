import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AnswerI } from '@models/answer.interface';
import { AnswerService } from '@shared/services/answer/answer.service';

@Component({
  selector: 'app-answers-page',
  templateUrl: './answers.page.html',
  styleUrls: ['./answers.page.scss']
})
export class AnswersPageComponent implements OnInit {
  public answers: Observable<AnswerI[]>;

  constructor(private answerService: AnswerService, private route: ActivatedRoute) { }

  ngOnInit() {
    const serviceId = this.route.parent.snapshot.params.id;
    const id = this.route.snapshot.params.id;

    this.answers = this.answerService.loadAnswers(serviceId, id);
  }
}
