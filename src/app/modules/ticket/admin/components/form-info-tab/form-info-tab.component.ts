import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject, concat, of } from 'rxjs';
import { finalize, filter, debounceTime, tap, switchMap, map } from 'rxjs/operators';

import { TagI } from '@interfaces/tag.interface';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { ServiceService } from '@shared/services/service/service.service';
import { TicketService } from '@shared/services/ticket/ticket.service';
import { ResponsibleUserService } from '@shared/services/responsible_user/responsible-user.service';
import { ResponsibleUserFactory } from '@modules/ticket/factories/responsible-user.factory';
import { contentBlockAnimation } from '@animations/content.animation';

@Component({
  selector: 'app-form-info-tab',
  templateUrl: './form-info-tab.component.html',
  styleUrls: ['./form-info-tab.component.sass'],
  animations: [contentBlockAnimation]
})
export class FormInfoTabComponent implements OnInit {
  loading = {
    tags: false,
    responsibleUsers: false,
    serviceTags: false
  };
  tags: Observable<TagI[]>;
  responsibleUsers: Observable<ResponsibleUserI[]>;
  tagInput = new Subject<string>();
  responsibleUserInput = new Subject<string>();
  serviceTags: { data: TagI, htmlString: string }[];
  @Input() ticketForm: FormGroup;

  constructor(
    private serviceService: ServiceService,
    private ticketService: TicketService,
    private responsibleUserService: ResponsibleUserService
  ) { }

  ngOnInit() {
    this.loadTags();
    this.loadResponsibleUsers();
    this.loadServiceTags();
  }

  get form() {
    return this.ticketForm.controls;
  }

  get form_info() {
    return (this.form.form as FormGroup).controls;
  }

  /**
   * Переключает состояние "is_hidden" у указанного объекта.
   */
  toggleHidden(): void {
    const currentValue = this.form.is_hidden.value;

    this.form.is_hidden.setValue(!currentValue);
  }

  /**
   * Добавляет тег к вопросу.
   *
   * @params tag - тег
   */
  addTag(tag: TagI): void {
    const tags: TagI[] = this.form.tags.value.slice();

    if (!tags.some(el => el.name === tag.name)) {
      tag.selected = true;
      tags.push(tag);
      this.form.tags.setValue(tags);
    }
  }

  /**
   * Спрятать тег в списке.
   *
   * @params tag - тег
   */
  hideTag(tag: TagI): void {
    const serviceTag = this.serviceTags.find(el => el.data.name === tag.name);

    if (serviceTag) {
      serviceTag.data.selected = true;
    }
  }

  /**
   * Показать тег в списке.
   *
   * @param data -данные, содержащие тег в поле value
   */
  showTag(data: any): void {
    const serviceTag = this.serviceTags.find(el => el.data.name === data.value.name);

    if (serviceTag) {
      serviceTag.data.selected = false;
    }
  }

  trackByServiceTag(index, serviceTag: any) {
    return serviceTag.data.id;
  }

  private loadServiceTags(): void {
    this.loading.serviceTags = true;
    this.serviceService.loadTags()
      .pipe(finalize(() => this.loading.serviceTags = false))
      .subscribe((tags: TagI[]) => {
        this.serviceTags = tags.map(tag => {
          return {
            data: tag,
            htmlString: `<span class="badge badge-secondary">${tag.name}</span>`
          };
        });
      });
  }

  private loadTags(): void {
    this.tags = concat(
      of([]),
      this.tagInput.pipe(
        filter(term => term && term.length >= 2),
        debounceTime(300),
        tap(() => this.loading.tags = true),
        switchMap(term => this.ticketService.loadTags(term).pipe(finalize(() => this.loading.tags = false)))
      )
    );
  }

  private loadResponsibleUsers(): void {
    this.responsibleUsers = concat(
      of([]),
      this.responsibleUserInput.pipe(
        filter(term => term && term.length >= 2),
        debounceTime(300),
        tap(() => this.loading.responsibleUsers = true),
        switchMap(term => {
          const type = isNaN(term as any) ? 'fullName' : 'personnelNo';

          return this.responsibleUserService.searchUsers(type, term).pipe(
            finalize(() => this.loading.responsibleUsers = false),
            map(result => result.map(details => ResponsibleUserFactory.createByDetails(details)))
          );
        })
      )
    );
  }
}
