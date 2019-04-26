import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { takeWhile, map, switchMap } from 'rxjs/operators';

import { ServiceTemplateI } from '@interfaces/service-template.interface';
import { TemplateService } from '@shared/services/template/template.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  result: ServiceTemplateI[];
  selectedType = new BehaviorSubject<string>('all');
  @Input() searchResult: Observable<ServiceTemplateI[]>;
  private alive = true;

  constructor(private templateService: TemplateService) {}

  ngOnInit() {
    this.searchResult
      .pipe(
        takeWhile(() => this.alive),
        switchMap((arr: ServiceTemplateI[]) => {
          return this.selectedType.pipe(
            map((type: 'all' | 'Category' | 'Service' | 'Ticket') => this.filterTemplateArr(arr, type))
          );
        })
      )
      .subscribe((result: ServiceTemplateI[]) => this.result = result);
  }

  generateServiceLink(currentTemplate): string {
    return this.templateService.generateUrlBy(currentTemplate);
  }

  selectType(type: 'all' | 'Category' | 'Service' | 'Ticket'): void {
    this.selectedType.next(type);
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private filterTemplateArr(arr: ServiceTemplateI[], filterType: string): ServiceTemplateI[] {
    if (filterType === 'all') {
      return arr;
    }

    return this.templateService.filterTemplateArr(arr, filterType);
  }
}
