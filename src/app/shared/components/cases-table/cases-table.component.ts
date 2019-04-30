import { Component, OnInit, Input } from '@angular/core';

import { CaseI } from '@interfaces/case.interface';

@Component({
  selector: 'app-cases-table',
  templateUrl: './cases-table.component.html',
  styleUrls: ['./cases-table.component.scss']
})
export class CasesTableComponent implements OnInit {
  @Input() cases: CaseI[] = [];
  @Input() loading = false;

  constructor() { }

  ngOnInit() {}
}
