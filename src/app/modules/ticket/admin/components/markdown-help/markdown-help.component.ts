import { Component, OnInit, Renderer2, ViewChild, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-markdown-help',
  templateUrl: './markdown-help.component.html',
  styleUrls: ['./markdown-help.component.sass']
})
export class MarkdownHelpComponent implements OnInit {
  @ViewChild('markdownScrollParent', { static: true }) markdownScrollParent: ElementRef;
  @HostListener('window:scroll') onScroll() {
    const componentPosition = this.markdownScrollParent.nativeElement.offsetTop;
    const scrollPosition = window.pageYOffset;
    const scroller = this.markdownScrollParent.nativeElement.querySelector('.scroller');

    if (scrollPosition > (componentPosition - 30)) {
      this.renderer.setStyle(scroller, 'position', 'fixed');
      this.renderer.setStyle(scroller, 'top', '30px');
    } else {
      this.renderer.setStyle(scroller, 'position', 'relative');
      this.renderer.removeStyle(scroller, 'top');
    }
  }

  constructor(private renderer: Renderer2) { }

  ngOnInit() {}
}
