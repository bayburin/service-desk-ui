import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'environments/environment';
import { TagService } from './tag.service';
import { TagI } from '@interfaces/tag.interface';
import { HttpParams } from '@angular/common/http';

describe('TagService', () => {
  let httpTestingController: HttpTestingController;
  let tagService: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    tagService = TestBed.get(TagService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(tagService).toBeTruthy();
  });

  describe('#loadTags', () => {
    const tagUri = `${environment.serverUrl}/api/v1/tags`;
    const tags: TagI[] = [
      { id: 1, name: 'tag 1' },
      { id: 2, name: 'tag 2' }
    ];
    const term = 'term';
    const searchParams = new HttpParams().set('search', term);

    it('should return Observable with finded tags', () => {
      tagService.loadTags(term).subscribe(result => {
        expect(result).toEqual(tags);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: `${tagUri}?${searchParams}`
      }).flush(tags);
    });
  });

  describe('#popular', () => {
    it('should return Observable with array of tags', () => {
      const serviceId = 1;
      const limit = 20;
      const tagsUri = `${environment.serverUrl}/api/v1/tags/popular`;
      const params = new HttpParams().set('service_id', `${serviceId}`).set('limit', `${limit}`);
      const tags: TagI[] = [
        { id: 1, name: 'Tag 1', popularity: 4 },
        { id: 2, name: 'Tag 2', popularity: 1 }
      ];

      tagService.popular(serviceId, limit).subscribe(result => {
        expect(result).toEqual(tags);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: `${tagsUri}?${params}`
      }).flush(tags);
    });
  });
});
