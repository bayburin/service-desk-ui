import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-markdown-help-page',
  templateUrl: './markdown-help.page.html',
  styleUrls: ['./markdown-help.page.sass']
})
export class MarkdownHelpPageComponent implements OnInit {
  selectedOption: string;
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

  /**
   * Перемещает экран к указанному id.
   */
  scrollToElement(element: Element): void {
    this.selectedOption = element.getAttribute('id');
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
