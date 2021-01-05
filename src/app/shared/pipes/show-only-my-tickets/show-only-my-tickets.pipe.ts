import { Pipe, PipeTransform } from '@angular/core';

import { UserService } from '@shared/services/user/user.service';
import { User } from '@shared/models/user/user.model';
import { Question } from '@modules/ticket/models/question/question.model';

@Pipe({
  name: 'showOnlyMyTickets',
  pure: true
})
export class ShowOnlyMyTicketsPipe implements PipeTransform {
  user: User;

  constructor(private userService: UserService) {
    this.userService.user.subscribe((user: User) => this.user = user);
  }

  transform(arr: Question[], flag: boolean): any {
    if (this.user && flag) {
      return arr.filter(question => {
        return question.isBelongsTo(this.user) || question.correction && question.correction.isBelongsTo(this.user);
      });
    } else {
      return arr;
    }
  }
}
