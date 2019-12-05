import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFileIconChange]'
})
export class FileIconChangeDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  /**
   * @param filename - имя файла, на основании которого выбирается иконка
   */
  @Input() set appFileIconChange(filename: string) {
    const fileType = filename.match(/\.(\w+)$/);
    let icon: string;

    if (!fileType) {
      return;
    }

    switch (fileType[1]) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'tif':
      case 'tiff':
      case 'gif':
      case 'bmp':
      case 'svg':
        icon = 'mdi-file-image-outline';
        break;
      case 'pdf':
        icon = 'mdi-file-pdf-outline';
        break;
      case 'txt':
      case 'doc':
      case 'docx':
      case 'rtf':
        icon = 'mdi-file-word-outline';
        break;
      case 'xls':
      case 'xlsx':
        icon = 'mdi-file-excel-outline';
        break;
      case 'ppt':
      case 'pptx':
        icon = 'mdi-file-powerpoint-outline';
        break;
      case 'zip':
      case '7z':
      case 'rar':
        icon = 'mdi-folder-zip-outline';
        break;
      case 'exe':
      case 'cmd':
      case 'bat':
      case 'ps1':
      case 'msi':
        icon = 'mdi-application';
        break;
      case 'chm':
      case 'hlp':
        icon = 'mdi-file-question-outline';
        break;
      default:
        icon = 'mdi-file-download-outline';
        break;
    }
    this.renderer.addClass(this.elementRef.nativeElement, icon);
  }
}
