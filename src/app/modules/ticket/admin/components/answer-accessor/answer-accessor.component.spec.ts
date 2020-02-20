import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {} from 'jasmine';

import { AnswerAccessorComponent } from './answer-accessor.component';
import { SimpleTemplateFormatter } from '../../features/markdown/simple-template-formatter';
import { ComplexTemplateFormatter } from '../../features/markdown/complex-template-formatter';
import { SimpleTextFormatter } from '../../features/markdown/simple-text-formatter';

describe('AnswerAccessorComponent', () => {
  let component: AnswerAccessorComponent;
  let fixture: ComponentFixture<AnswerAccessorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AnswerAccessorComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerAccessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Command buttons', () => {
    const formattedText = 'Formatted Text';

    beforeEach(() => {
      spyOn(component, 'writeValue');
      spyOn((component as any).markdown, 'format').and.returnValue(formattedText);
    });

    describe('#bold', () => {
      beforeEach(() => component.bold());

      it('should call #format method for markdown instance', () => {
        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(jasmine.any(SimpleTemplateFormatter), `**term**`, { defaultText: 'текст' });
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#italic', () => {
      beforeEach(() => component.italic());

      it('should call #format method for markdown instance', () => {
        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(jasmine.any(SimpleTemplateFormatter), `_term_`, { defaultText: 'текст' });
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#crossed_out', () => {
      beforeEach(() => component.crossed_out());

      it('should call #format method for markdown instance', () => {
        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(jasmine.any(SimpleTemplateFormatter), `~~term~~`, { defaultText: 'текст' });
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#empty_line', () => {
      beforeEach(() => component.empty_line());

      it('should call #format method for markdown instance', () => {
        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(jasmine.any(SimpleTextFormatter), `<br>`, { defaultText: '' });
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#link', () => {
      beforeEach(() => component.link());

      it('should call #format method for markdown instance', () => {
        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(jasmine.any(SimpleTemplateFormatter), `[term](https://адрес_ссылки)`, { defaultText: 'описание ссылки' });
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#image', () => {
      beforeEach(() => component.image());

      it('should call #format method for markdown instance', () => {
        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(
            jasmine.any(SimpleTemplateFormatter),
            `![term](https://адрес_ссылки)`,
            { defaultText: 'описание изображения' }
          );
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#quote', () => {
      beforeEach(() => component.quote());

      it('should call #format method for markdown instance', () => {
        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(
            jasmine.any(ComplexTemplateFormatter),
            `> term`,
            { defaultText: 'цитата', multilineTemplate: '\n\n> term\n\n' }
          );
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#code', () => {
      beforeEach(() => component.code());

      it('should call #format method for markdown instance', () => {
        const template = `~~~
term
~~~`;

        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(
            jasmine.any(ComplexTemplateFormatter),
            template,
            { defaultText: 'фрагмент', multilineTemplate: '`term`' }
          );
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#horizontal_line', () => {
      beforeEach(() => component.horizontal_line());

      it('should call #format method for markdown instance', () => {
        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(
            jasmine.any(ComplexTemplateFormatter),
            '***\n',
            { defaultText: '', multilineTemplate: '\n***\n' }
          );
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#number_list', () => {
      beforeEach(() => component.number_list());

      it('should call #format method for markdown instance', () => {
        const template = '1. term';

        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(
            jasmine.any(ComplexTemplateFormatter),
            template,
            { defaultText: 'Элемент списка', multilineTemplate: `\n${template}` }
          );
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#mark_list', () => {
      beforeEach(() => component.mark_list());

      it('should call #format method for markdown instance', () => {
        const template = '* term';

        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(
            jasmine.any(ComplexTemplateFormatter),
            template,
            { defaultText: 'Элемент списка', multilineTemplate: `\n${template}` }
          );
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#table', () => {
      beforeEach(() => component.table());

      it('should call #format method for markdown instance', () => {
        const template = `| Заголовок 1 | Заголовок 2 |
| ------------- | ------------- |
| Столбец 1 | Столбец 2 |\n\n`;

        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(
            jasmine.any(ComplexTemplateFormatter),
            template,
            { defaultText: '', multilineTemplate: `\n\n${template}` }
          );
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });

    describe('#header', () => {
      beforeEach(() => component.header(4));

      it('should call #format method for markdown instance', () => {
        const template = '#### term';

        expect((component as any).markdown.format)
          .toHaveBeenCalledWith(
            jasmine.any(ComplexTemplateFormatter),
            template,
            { defaultText: 'Заголовок', multilineTemplate: `\n${template}\n` }
          );
      });

      it('should call #writeValue method with markdowned text', () => {
        expect(component.writeValue).toHaveBeenCalledWith(formattedText);
      });
    });
  });
});
