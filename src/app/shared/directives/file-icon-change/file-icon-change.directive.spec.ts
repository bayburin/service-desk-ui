import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';

import { FileIconChangeDirective } from './file-icon-change.directive';

@Component({
  template: `<div [appFileIconChange]="filename">Тестовый компонент</div>`
})
class TestContainerComponent {
  filename: string;
}

describe('FileIconChangeDirective', () => {
  let fixture: ComponentFixture<TestContainerComponent>;
  let component: TestContainerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestContainerComponent,
        FileIconChangeDirective
      ]
    });

    fixture = TestBed.createComponent(TestContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  ['jpg', 'jpeg', 'png', 'tif', 'tiff', 'gif', 'bmp', 'svg'].forEach(type => {
    describe(`if set "${type}" type`, () => {
      beforeEach(() => {
        component.filename = `filename.${type}`;
        fixture.detectChanges();
      });

      it('should add class "mdi-file-image-outline"', () => {
        expect(fixture.debugElement.query(By.css('.mdi-file-image-outline'))).toBeTruthy();
      });
    });
  });

  describe(`if set "pdf" type`, () => {
    beforeEach(() => {
      component.filename = 'filename.pdf';
      fixture.detectChanges();
    });

    it('should add class "mdi-file-pdf-outline"', () => {
      expect(fixture.debugElement.query(By.css('.mdi-file-pdf-outline'))).toBeTruthy();
    });
  });

  ['txt', 'doc', 'docx', 'rtf'].forEach(type => {
    describe(`if set "${type}" type`, () => {
      beforeEach(() => {
        component.filename = `filename.${type}`;
        fixture.detectChanges();
      });

      it('should add class "mdi-file-word-outline"', () => {
        expect(fixture.debugElement.query(By.css('.mdi-file-word-outline'))).toBeTruthy();
      });
    });
  });

  ['xls', 'xlsx'].forEach(type => {
    describe(`if set "${type}" type`, () => {
      beforeEach(() => {
        component.filename = `filename.${type}`;
        fixture.detectChanges();
      });

      it('should add class "mdi-file-excel-outline"', () => {
        expect(fixture.debugElement.query(By.css('.mdi-file-excel-outline'))).toBeTruthy();
      });
    });
  });

  ['ppt', 'pptx'].forEach(type => {
    describe(`if set "${type}" type`, () => {
      beforeEach(() => {
        component.filename = `filename.${type}`;
        fixture.detectChanges();
      });

      it('should add class "mdi-file-powerpoint-outline"', () => {
        expect(fixture.debugElement.query(By.css('.mdi-file-powerpoint-outline'))).toBeTruthy();
      });
    });
  });

  ['zip', '7z', 'rar'].forEach(type => {
    describe(`if set "${type}" type`, () => {
      beforeEach(() => {
        component.filename = `filename.${type}`;
        fixture.detectChanges();
      });

      it('should add class "mdi-folder-zip-outline"', () => {
        expect(fixture.debugElement.query(By.css('.mdi-folder-zip-outline'))).toBeTruthy();
      });
    });
  });

  ['exe', 'cmd', 'bat', 'ps1', 'msi'].forEach(type => {
    describe(`if set "${type}" type`, () => {
      beforeEach(() => {
        component.filename = `filename.${type}`;
        fixture.detectChanges();
      });

      it('should add class "mdi-application"', () => {
        expect(fixture.debugElement.query(By.css('.mdi-application'))).toBeTruthy();
      });
    });
  });

  ['chm', 'hlp'].forEach(type => {
    describe(`if set "${type}" type`, () => {
      beforeEach(() => {
        component.filename = `filename.${type}`;
        fixture.detectChanges();
      });

      it('should add class "mdi-application"', () => {
        expect(fixture.debugElement.query(By.css('.mdi-file-question-outline'))).toBeTruthy();
      });
    });
  });

  describe(`if set another type`, () => {
    beforeEach(() => {
      component.filename = 'filename.another_type';
      fixture.detectChanges();
    });

    it('should add class "mdi-file-download-outline"', () => {
      expect(fixture.debugElement.query(By.css('.mdi-file-download-outline'))).toBeTruthy();
    });
  });
});
