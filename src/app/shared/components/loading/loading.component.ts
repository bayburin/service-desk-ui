import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() loading: boolean;
  @Input() size: '18px' | '24px' | '36px' | '48px';

  constructor() { }

  ngOnInit() {}
}
