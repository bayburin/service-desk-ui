import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'environments/environment';
import { CategoryService } from './category.service';
import { CategoryI } from '@interfaces/category.interface';
import { CategoryFactory } from '@modules/ticket/factories/category.factory';

describe('CategoryService', () => {
  let httpTestingController: HttpTestingController;
  let categoryService: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    categoryService = TestBed.get(CategoryService);
  });

  it('should be created', () => {
    expect(categoryService).toBeTruthy();
  });

  describe('#loadCategories', () => {
    const returnedCategory = { id: 1 } as CategoryI;
    const categories = [CategoryFactory.create(returnedCategory)];
    const loadCategoriesUri = `${environment.serverUrl}/api/v1/categories`;

    it('should return Observable with array of Category data', () => {
      categoryService.loadCategories().subscribe(result => {
        expect(result).toEqual(categories);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadCategoriesUri
      }).flush([returnedCategory]);
    });
  });

  describe('#loadCategory', () => {
    const categoryI = { id: 1, name: 'test' } as CategoryI;
    const category = CategoryFactory.create(categoryI);
    const loadCategoryUri = `${environment.serverUrl}/api/v1/categories/${category.id}`;

    it('should return Observable with Category data', () => {
      categoryService.loadCategory(category.id).subscribe(result => {
        expect(result).toEqual(category);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadCategoryUri
      }).flush(categoryI);
    });

    it('should emit Category data to category subject', () => {
      const spy = spyOn((categoryService as any).category, 'next');

      categoryService.loadCategory(category.id).subscribe(data => {
        expect(spy).toHaveBeenCalledWith(data);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: loadCategoryUri
      }).flush(categoryI);
    });
  });

  describe('#getNodeName', () => {
    it('should return Observale with category name if category exists', () => {
      const categoryI = { id: 1, name: 'My category' } as CategoryI;
      const category = CategoryFactory.create(categoryI);

      (categoryService as any).category.next(category);
      categoryService.getNodeName().subscribe(result => {
        expect(result).toEqual(category.name);
      });
      (categoryService as any).category.next(category);
    });

    it('should return Observale with empty string if category not exist', () => {
      categoryService.getNodeName().subscribe(result => {
        expect(result).toEqual('');
      });

      (categoryService as any).category.next(null);
    });
  });

  describe('#getParentNodeName', () => {
    it('should run "getNodeName" method', () => {
      const spy = spyOn(CategoryService.prototype, 'getNodeName');
      categoryService.getParentNodeName();

      expect(spy).toHaveBeenCalled();
    });
  });
});
