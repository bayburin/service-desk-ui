import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchResult'
})
export class SearchResultFilterPipe implements PipeTransform {
  transform(resultArr: any, klass?: any): any {
    if (!klass) {
      return resultArr;
    }

    return resultArr.filter(val => val instanceof klass);
  }
}
