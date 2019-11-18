import { Component, OnInit, Input } from '@angular/core';

import { ResponsibleUserI } from '@interfaces/responsible-user.interface';

@Component({
  selector: 'app-responsible-user-details',
  templateUrl: './responsible-user-details.component.html',
  styleUrls: ['./responsible-user-details.component.sass']
})
export class ResponsibleUserDetailsComponent implements OnInit {
  @Input() label: string;
  @Input() users: ResponsibleUserI[];

  constructor() { }

  ngOnInit() {}

  /**
   * Возвращает true, если в массиве users имеется хотя бы один ответственный с объектом details.
   */
  isShowDetails(): boolean {
    return this.users.some(user => user.details ? true : false);
  }
}
