import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpEventType } from '@angular/common/http';

import { AttachmentService } from './attachment.service';
import { AnswerAttachmentI } from '@interfaces/answer-attachment.interface';
import { environment } from 'environments/environment';

describe('AttachmentService', () => {
  let service: AttachmentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(AttachmentService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#uploadAttachment', () => {
    const file = new Blob(['test'], { type: 'application/json' });
    const attachment = { answer_id: 1, document: file } as AnswerAttachmentI;
    const expectedAttachment = { id: 2, answer_id: 1, filename: 'Тестовое имя файла' };
    const uploadAttachmentUrl = `${environment.serverUrl}/api/v1/answers/${attachment.answer_id}/answer_attachments`;

    it('should add "InterceptorSkipJSONHeaders" header to request', () => {
      service.uploadAttachment(attachment).subscribe(result => {
        expect(result).toBeTruthy();
      });

      httpTestingController.expectOne(req => {
        return req.headers.has('InterceptorSkipJSONHeaders');
      }).flush(expectedAttachment);
    });

    it('should return Observable', () => {
      service.uploadAttachment(attachment).subscribe(response => {
        if (response.type === HttpEventType.Response) {
          expect(response.body).toEqual(expectedAttachment);
        }
      });

      httpTestingController.expectOne({
        method: 'POST',
        url: uploadAttachmentUrl
      }).flush(expectedAttachment);
    });
  });

  describe('#downloadAttachment', () => {
    const attachment = { id: 1, answer_id: 2 } as AnswerAttachmentI;
    const downloadAttachmentUrl = `${environment.serverUrl}/api/v1/answers/${attachment.answer_id}/answer_attachments/${attachment.id}`;
    const expectedAttachment = new Blob(['test'], { type: 'application/json' });

    it('should return Observable with blob data', () => {
      service.downloadAttachment(attachment).subscribe(data => {
        expect(data).toEqual(expectedAttachment);
      });

      httpTestingController.expectOne({
        method: 'GET',
        url: downloadAttachmentUrl
      }).flush(expectedAttachment);
    });
  });

  describe('#removeAttachment', () => {
    const attachment = { id: 1, answer_id: 2 } as AnswerAttachmentI;
    const removeAttachmentUrl = `${environment.serverUrl}/api/v1/answers/${attachment.answer_id}/answer_attachments/${attachment.id}`;
    const expectedAttachment = { id: 2, answer_id: 1, filename: 'Тестовое имя файла' };

    it('should return Observable with removed attachment object', () => {
      service.removeAttachment(attachment).subscribe(data => {
        expect(data).toEqual(expectedAttachment);
      });

      httpTestingController.expectOne({
        method: 'DELETE',
        url: removeAttachmentUrl
      }).flush(expectedAttachment);
    });
  });
});
