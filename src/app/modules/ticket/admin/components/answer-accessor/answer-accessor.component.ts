import { Component, forwardRef, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MarkdownText } from '@modules/ticket/admin/features/markdown/markdown-text';
import { ComplexTemplateFormatter } from '@modules/ticket/admin/features/markdown/complex-template-formatter';
import { SimpleTextFormatter } from '@modules/ticket/admin/features/markdown/simple-text-formatter';
import { SimpleTemplateFormatter } from '@modules/ticket/admin/features/markdown/simple-template-formatter';

@Component({
  selector: 'app-answer-accessor',
  templateUrl: './answer-accessor.component.html',
  styleUrls: ['./answer-accessor.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AnswerAccessorComponent),
      multi: true
    }
  ]
})
export class AnswerAccessorComponent implements ControlValueAccessor, AfterViewChecked {
  value: string;
  private markdown: MarkdownText;
  @ViewChild('answer', { static: true }) answerEl: ElementRef;

  constructor() {}

  ngAfterViewChecked(): void {
    this.markdown = new MarkdownText(this.answerEl);
  }

  onChange: any = (val: any) => {};

  onTouched: any = (val: any) => {};

  /**
   * Записывает новое значение в элемент формы из модели.
   */
  writeValue(value: string): void {
    if (!value || typeof value !== 'string') {
      return;
    }

    this.value = value;
    this.onChange(value);
  }

  /**
   * Вызывает функцию обратного вызова в случае изменения значения в UI.
   *
   * @param fn - ф-я обратного вызова
   */

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Вызывает функцию обраного вызова, если пользователь затронул компонент.
   *
   * @param fn - ф-я обратного вызова
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Событие ввода или изменения данных.
   *
   * @param - данные в поле textarea
   */
  updateValue(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  /**
   * Текст, выделенный жирным шрифтом.
   */
  bold(): void {
    const formatter = new SimpleTemplateFormatter();

    this.writeValue(this.markdown.format(formatter, `**term**`, { defaultText: 'текст' }));
  }

  /**
   * Текст курсивом.
   */
  italic(): void {
    const formatter = new SimpleTemplateFormatter();

    this.writeValue(this.markdown.format(formatter, `_term_`, { defaultText: 'текст' }));
  }

  /**
   * Зачеркнутый текст.
   */
  crossed_out(): void {
    const formatter = new SimpleTemplateFormatter();

    this.writeValue(this.markdown.format(formatter, `~~term~~`, { defaultText: 'текст' }));
  }

  /**
   * Пустая строка.
   */
  empty_line(): void {
    const formatter = new SimpleTextFormatter();

    this.writeValue(this.markdown.format(formatter, `<br>`, { defaultText: '' }));
  }

  /**
   * Ссылка.
   */
  link(): void {
    const formatter = new SimpleTemplateFormatter();

    this.writeValue(this.markdown.format(formatter, `[term](https://адрес_ссылки)`, { defaultText: 'описание ссылки' }));
  }

  /**
   * Изображение.
   */
  image(): void {
    const formatter = new SimpleTemplateFormatter();

    this.writeValue(this.markdown.format(formatter, `![term](https://адрес_ссылки)`, { defaultText: 'описание изображения' }));
  }

  /**
   * Цитата.
   */
  quote(): void {
    const formatter = new ComplexTemplateFormatter();

    this.writeValue(this.markdown.format(formatter, `> term`, { defaultText: 'цитата', multilineTemplate: '\n\n> term\n\n' }));
  }

  /**
   * Фрагмент кода.
   */
  code(): void {
    const template = `~~~
term
~~~`;
    const formatter = new ComplexTemplateFormatter();

    this.writeValue(this.markdown.format(formatter, template, { defaultText: 'фрагмент', multilineTemplate: '`term`' }));
  }

  /**
   * Горизонтальная линия.
   */
  horizontal_line(): void {
    const formatter = new ComplexTemplateFormatter();
    const template = `***\n`;

    this.writeValue(this.markdown.format(formatter, template, { defaultText: '', multilineTemplate: `\n${template}` }));
  }

  /**
   * Нумерованный список.
   */
  number_list(): void {
    const formatter = new ComplexTemplateFormatter();
    const template = `1. term`;

    this.writeValue(this.markdown.format(formatter, template, { defaultText: 'Элемент списка', multilineTemplate: `\n${template}` }));
  }

  /**
   * Маркированный список.
   */
  mark_list(): void {
    const formatter = new ComplexTemplateFormatter();
    const template = `* term`;

    this.writeValue(this.markdown.format(formatter, template, { defaultText: 'Элемент списка', multilineTemplate: `\n${template}` }));
  }

  /**
   * Таблица.
   */
  table(): void {
    const template = `| Заголовок 1 | Заголовок 2 |
| ------------- | ------------- |
| Столбец 1 | Столбец 2 |\n\n`;
    const multilineTemplate = `\n\n${template}`;
    const formatter = new ComplexTemplateFormatter();

    this.writeValue(this.markdown.format(formatter, template, { defaultText: '', multilineTemplate }));
  }

  /**
   * Заголовок.
   *
   * @param level - уровень заголовка
   */
  header(level: number): void {
    const template = `${'#'.repeat(level)} term`;
    const multilineTemplate = `\n${template}\n`;
    const formatter = new ComplexTemplateFormatter();

    this.writeValue(this.markdown.format(formatter, template, { defaultText: 'Заголовок', multilineTemplate }));
  }
}
