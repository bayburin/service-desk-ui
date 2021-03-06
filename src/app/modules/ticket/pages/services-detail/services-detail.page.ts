import { Component, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, filter, first, map, delay, tap, switchMap } from 'rxjs/operators';

import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
import { ServiceDetailComponent } from '@modules/ticket/components/service-detail/service-detail.component';
// import { DynamicTemplateContentComponent } from '@modules/ticket/components/dynamic-template-content/dynamic-template-content.component';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { UserPolicy } from '@shared/policies/user/user.policy';
import { QuestionPageContentComponent } from '@modules/ticket/components/question-page-content/question-page-content.component';

@Component({
  selector: 'app-services-detail-page',
  templateUrl: './services-detail.page.html',
  styleUrls: ['./services-detail.page.scss']
})
export class ServicesDetailPageComponent implements OnInit, AfterViewChecked, OnDestroy {
  loading = false;
  service: Service;
  @ViewChild(ServiceDetailComponent, { static: false }) private serviceDetailComponent: ServiceDetailComponent;
  private questionStream = new Subject();
  private identity: number;

  constructor(
    private serviceService: ServiceService,
    public route: ActivatedRoute,
    private responsibleUserService: ResponsibleUserService,
    private policy: UserPolicy
  ) {}

  ngOnInit() {
    this.identity = this.route.snapshot.queryParams.identity;
    this.loadService();
    this.openQuestionStream();
  }

  ngAfterViewChecked() {
    if (!this.identity || !this.serviceDetailComponent) {
      return;
    }

    // const dynamicTemplateComponentArr = this.serviceDetailComponent.dynamicTemplateComponent.toArray();
    const questionComponentArr = this.serviceDetailComponent.questionComponent.toArray();
    this.questionStream.next(questionComponentArr);
  }

  ngOnDestroy() {
    this.serviceService.service$.next(null);
  }

  /**
   * Загружает данные об услуге, включая заявки, вопросы и ответы.
   */
  loadService(): void {
    const categoryId = this.route.parent.snapshot.params.id;
    const serviceId = this.route.snapshot.params.id;

    this.loading = true;
    this.serviceService.loadService(categoryId, serviceId)
      .pipe(
        finalize(() => this.loading = false),
        tap(service => this.service = service),
        filter(() => this.policy.authorize(null, 'responsibleUserAccess')),
        switchMap(service => this.responsibleUserService.loadDetails(service.getResponsibleUsersTn())),
        tap(details => this.service.associateResponsibleUserDetails(details))
      )
      .subscribe();
  }

  /**
   * Создает подписку для раскрытия выбранного вопроса после рендера страницы.
   */
  private openQuestionStream(): void {
    this.questionStream
      .pipe(
        filter((componentArr: []) => componentArr.length !== 0),
        first(),
        delay(300),
        map(componentArr => this.openSelectedQuestion(componentArr))
      )
      .subscribe();
  }

  /**
   * Вызывает метод toggleQuestion() у компонента для раскрытия вопроса.
   *
   * @param componentArr - массив компонентов, содержащих тикет.
   */
  private openSelectedQuestion(componentArr: QuestionPageContentComponent[]): void {
    const selectedComponent = componentArr.find(el => el.data.identity == this.identity);

    // selectedComponent.componentRef.instance.toggleQuestion();
    selectedComponent.toggleQuestion();
    this.scrollToTicket();
  }

  /**
   * Перемещает экран к указанному id.
   */
  private scrollToTicket(): void {
    const el = document.getElementById(`${this.identity}`);

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
