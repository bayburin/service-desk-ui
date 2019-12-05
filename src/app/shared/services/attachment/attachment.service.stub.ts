import { of } from 'rxjs';

export class StubAttachmentService {
  uploadAttachment() { return of({}); }
  downloadAttachment() { return of(null); }
  removeAttachment() { return of(null); }
}
