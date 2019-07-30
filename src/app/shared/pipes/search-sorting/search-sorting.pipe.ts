import { Pipe, PipeTransform } from '@angular/core';

import { Category } from '@modules/ticket/models/category.model';
import { Service } from '@modules/ticket/models/service.model';
import { Ticket } from '@modules/ticket/models/ticket/ticket.model';

@Pipe({
  name: 'searchSorting'
})
export class SearchSortingPipe implements PipeTransform {
  // Порядок: Категория -> Услуги -> Заявки -> Вопросы
  transform(resultArr: (Category | Service | Ticket)[]): any {
    return resultArr.sort((a, b) => {
      if (a instanceof Category || a instanceof Service && b instanceof Ticket) {
        return -1;
      }

      if (
        a instanceof Service && b instanceof Category ||
        a instanceof Ticket && (b instanceof Service || b instanceof Category)
      ) {
        return 1;
      }

      if (a instanceof Ticket && a.isCase()) {
        return -1;
      }
    });
  }
}
