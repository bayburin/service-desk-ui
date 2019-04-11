import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { CaseService } from '@modules/case/services/case/case.service';
import { CaseI } from '@models/case.interface';

@Component({
  selector: 'app-cases-page',
  templateUrl: './cases.page.html',
  styleUrls: ['./cases.page.scss']
})
export class CasesPageComponent implements OnInit {
  public cases: Observable<CaseI[]>;
  public selectedType = new BehaviorSubject<string>('all');

  constructor(private caseService: CaseService) { }

  ngOnInit() {
    this.cases = this.caseService.getAllCases();
  }

  selectType(type: 'all' | 'done' | 'at_work' | 'removed' | 'canceled'): void {
    this.selectedType.next(type);
  }
}
