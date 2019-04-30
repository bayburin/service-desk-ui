import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchResult'
})
export class SearchResultPipe implements PipeTransform {
  transform(value: any, klass?: any): any {
    if (!klass) {
      return value;
    }

    return value.filter(val => val instanceof klass);
  }
}
