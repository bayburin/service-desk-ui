import { Pipe, PipeTransform } from '@angular/core';

import { Category } from '@modules/ticket/models/category/category.model';
import { Service } from '@modules/ticket/models/service/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';
import { ClaimForm } from '@modules/ticket/models/claim-form/claim-form.model';
import { Question } from '@modules/ticket/models/question/question.model';

@Pipe({
  name: 'searchSorting'
})
export class SearchSortingPipe implements PipeTransform {
  // Порядок: Категория -> Услуги -> Заявки -> Вопросы
  transform(resultArr: (Category | Service | Ticket)[]): any {
    return resultArr.sort((a, b) => {
      // Сначала категории
      if (a instanceof Category || a instanceof Service && b instanceof Ticket) {
        return -1;
      }

      // Затем заявки
      if (
        a instanceof Service && b instanceof Category ||
        a instanceof Ticket && (b instanceof Service || b instanceof Category)
      ) {
        return 1;
      }

      // Заявки должны быть раньше вопросов
      if (a instanceof ClaimForm && b instanceof Question) {
        return -1;
      }

      // Сортировка заявок по популярности
      if (a instanceof ClaimForm && b instanceof ClaimForm) {
        return a.popularity > b.popularity ? -1 : 1;
      }

      // Сортировка вопросов по популярности
      if (a instanceof Question && b instanceof Question) {
        return a.popularity > b.popularity ? -1 : 1;
      }
    });
  }
}
