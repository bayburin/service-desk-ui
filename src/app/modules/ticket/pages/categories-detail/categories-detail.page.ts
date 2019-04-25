import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, share } from 'rxjs/operators';

import { CategoryI } from '@models/category.interface';
import { CategoryService } from '@shared/services/category/category.service';
import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'app-categories-detail-page',
  templateUrl: './categories-detail.page.html',
  styleUrls: ['./categories-detail.page.scss']
})
export class CategoriesDetailPageComponent implements OnInit {
  public loading = false;
  public isUserSignedIn: Observable<boolean>;
  public category$: Observable<CategoryI>;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isUserSignedIn = this.authService.isUserSignedIn;
    const categoryId = this.route.snapshot.params.id;

    this.loading = true;
    this.category$ = this.categoryService.loadCategory(categoryId).pipe(finalize(() => this.loading = false));
  }
}
