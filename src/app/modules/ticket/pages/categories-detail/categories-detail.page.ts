import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Category } from '@modules/ticket/models/category.model';
import { CategoryService } from '@shared/services/category/category.service';
import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'app-categories-detail-page',
  templateUrl: './categories-detail.page.html',
  styleUrls: ['./categories-detail.page.scss']
})
export class CategoriesDetailPageComponent implements OnInit {
  loading = false;
  isUserSignedIn: Observable<boolean>;
  category$: Observable<Category>;

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
