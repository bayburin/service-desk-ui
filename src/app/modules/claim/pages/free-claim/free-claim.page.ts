import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-free-claim-page',
  templateUrl: './free-claim.page.html',
  styleUrls: ['./free-claim.page.scss']
})
export class FreeClaimPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onSave() {
    this.router.navigate(['/cases']);
  }
}
