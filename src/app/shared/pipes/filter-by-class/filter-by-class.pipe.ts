import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByClass'
})
export class FilterByClassPipe implements PipeTransform {
  transform(resultArr: any, klass?: any): any {
    if (!klass) {
      return resultArr;
    }

    return resultArr.filter(val => val instanceof klass);
  }
}
