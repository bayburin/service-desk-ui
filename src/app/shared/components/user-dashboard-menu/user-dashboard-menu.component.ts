import { Component, OnInit, HostListener, ElementRef, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-user-dashboard-menu',
  templateUrl: './user-dashboard-menu.component.html',
  styleUrls: ['./user-dashboard-menu.component.sass']
})
export class UserDashboardMenuComponent implements OnInit {
  @Input() calledElement: HTMLInputElement;
  @Output() clickedOutside = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {}

  @HostListener('document:click', ['$event.target']) onClickOutside(target) {
    if (!this.elementRef.nativeElement.contains(target) && this.calledElement !== target) {
      this.clickedOutside.next(true);
    }
  }
}
