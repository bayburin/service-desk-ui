import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, filter, first, map, delay } from 'rxjs/operators';

import { ServiceService } from '@shared/services/service/service.service';
import { Service } from '@modules/ticket/models/service/service.model';
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
  @ViewChild(ServiceDetailComponent, { static: true }) private serviceDetailComponent: ServiceDetailComponent;
  private questionStream = new Subject();
  private ticketId: number;

  constructor(private serviceService: ServiceService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.ticketId = this.route.snapshot.queryParams.ticket;
    this.loadService();
    this.openQuestionStream();
  }

  ngAfterViewChecked() {
    if (!this.ticketId) {
      return;
    }

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
      .subscribe(service => this.service = service);
  }

  /**
   * Создает подписку для раскрытия выбранного вопроса после рендера страницы.
   */
  openQuestionStream(): void {
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
   * Вызывает метод toggleTicket() у компонента для раскрытия вопроса.
   */
  openSelectedQuestion(componentArr: DynamicTemplateContentComponent[]): void {
    const selectedComponent = componentArr.find(el => el.data.id == this.ticketId);

    selectedComponent.componentRef.instance.toggleTicket();
    this.scrollToTicket();
  }

  /**
   * Перемещает экран к указанному Id.
   *
   * @param ticketId - id элемента
   */
  private scrollToTicket(): void {
    const el = document.getElementById(`${this.ticketId}`);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
