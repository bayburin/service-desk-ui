import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() loading: boolean;
  @Input() size: string;

  constructor() { }

  /**
   * Определяет, является ли размер шрифта "маленьким" (меньше 2).
   */
  isSmallSize(): boolean {
    return this.size && +(this.size.match(/(\d+).*/)[1]) <= 1;
  }
}
