import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-case-page',
  templateUrl: './common-case.page.html',
  styleUrls: ['./common-case.page.scss']
})
export class CommonCasePageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onSave() {
    this.router.navigate(['']);
  }
}
