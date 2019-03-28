import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AnswerService } from '@shared/services/answer/answer.service';

@Component({
  selector: 'app-serice-proxy',
  templateUrl: './service-proxy.component.html',
  styleUrls: ['./service-proxy.component.scss']
})
export class ServiceProxyComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private answerService: AnswerService
  ) {}

  ngOnInit() {
    const id = this.answerService.getAnswers()[0].ticket.service.category_id;
    const serviceId = this.route.snapshot.params.id;

    this.router.navigate(['/categories', id, 'services', serviceId]);
  }
}
