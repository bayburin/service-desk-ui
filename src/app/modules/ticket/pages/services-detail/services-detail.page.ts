import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, filter, first, map } from 'rxjs/operators';

import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service.model';
import { ServiceDetailComponent } from '@modules/ticket/components/service-detail/service-detail.component';
import { DynamicTemplateContentComponent } from '@modules/ticket/components/dynamic-template-content/dynamic-template-content.component';

@Component({
  selector: 'app-services-detail-page',
  templateUrl: './services-detail.page.html',
  styleUrls: ['./services-detail.page.scss']
})
export class ServicesDetailPageComponent implements OnInit, AfterViewChecked {
  loading = false;
  service: Service;
  @ViewChild(ServiceDetailComponent) private serviceDetailComponent: ServiceDetailComponent;
  private questionStream = new Subject();

  constructor(private serviceService: ServiceService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadService();
    this.openQuestionStream();
  }

  ngAfterViewChecked() {
    const dynamicTemplateComponentArr = this.serviceDetailComponent.dynamicTemplateComponent.toArray();

    this.questionStream.next(dynamicTemplateComponentArr);
  }

  /**
   * Загружает данные об услуге, включая заявки, вопросы и ответы.
   */
  loadService(): void {
    const categoryId = this.route.parent.snapshot.params.id;
    const serviceId = this.route.snapshot.params.id;

    this.loading = true;
    this.serviceService.loadService(categoryId, serviceId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        service => this.service = service,
        error => console.log('Ошибка ', error)
      );
  }

  /**
   * Создает подписку для раскрытия выбранного вопроса после рендера страницы.
   */
  openQuestionStream(): void {
    this.questionStream
      .pipe(
        filter((componentArr: []) => componentArr.length !== 0),
        first(),
        map(componentArr => this.openSelectedQuestion(componentArr))
      )
      .subscribe();
  }

  /**
   * Вызывает метод toggleTicket() у компонента для раскрытия вопроса.
   */
  openSelectedQuestion(componentArr: DynamicTemplateContentComponent[]): void {
    const ticketId = this.route.snapshot.queryParams.ticket;
    const selectedComponent = componentArr.find(el => el.data.id == ticketId);

    selectedComponent.componentRef.instance.toggleTicket();
    this.scrollToTicket(ticketId);
  }

  /**
   * Перемещает экран к указанному Id.
   *
   * @param ticketId - id элемента
   */
  private scrollToTicket(ticketId): void {
    const el = document.getElementById(ticketId);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
