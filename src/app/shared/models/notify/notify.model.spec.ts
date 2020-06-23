import { NotificationBodyI, NotificationI } from '@interfaces/notification.interface';

import { Notify } from '@shared/models/notify/notify.model';
import { NotifyFactory } from '@shared/factories/notify.factory';
import { BroadcastState } from './notify_states/broadcast.state';
import { ClaimState } from './notify_states/claim.state';
import { ErrorState } from './notify_states/error.state';

describe('Notify', () => {
  const notifyBodyI: NotificationBodyI = { message: 'test message', case_id: 1, user_tn: 1 };
  const notifyI: NotificationI = { id: 1, tn: 1, body: notifyBodyI, event_type: 'claim', date: '21-01-2017' };
  let notify: Notify;

  beforeEach(() => {
    notify = NotifyFactory.create(notifyI);
  });

  it('should create instance of Notify', () => {
    expect(new Notify({ event_type: 'broadcast' })).toBeTruthy();
  });

  it('should accept values', () => {
    notify = new Notify({ mockId: 1, ...notifyI });

    expect(notify.id).toEqual(notifyI.id);
    expect(notify.mockId).toEqual(1);
    expect(notify.eventType).toEqual(notifyI.event_type);
    expect(notify.tn).toEqual(notifyI.id);
    expect((notify as any).body).toEqual(notifyI.body);
    expect(notify.date).toEqual(notifyI.date);
  });

  it('should set message if its exists', () => {
    notify = new Notify({ message: 'test' });

    expect(notify.message).toEqual('test');
  });

  it('should create BroadcastState if event_type is "broadcast"', () => {
    notifyI.event_type = 'broadcast';
    notify = new Notify(notifyI);

    expect((notify as any).state instanceof BroadcastState).toBeTruthy();
  });

  it('should create ClaimState if event_type is "claim"', () => {
    notifyI.event_type = 'claim';
    notify = new Notify(notifyI);

    expect((notify as any).state instanceof ClaimState).toBeTruthy();
  });

  it('should create ErrorState if event_type is "error"', () => {
    notifyI.event_type = 'error';
    notify = new Notify(notifyI);

    expect((notify as any).state instanceof ErrorState).toBeTruthy();
  });

  it('should return message attribute from "body" object', () => {
    expect(notify.message).toEqual(notifyI.body.message);
  });

  it('should set string to "message" attribute of "body" object', () => {
    notify.message = 'New message';

    expect(notifyI.body.message).toEqual(notify.message);
  });

  describe('#getIconName', () => {
    it('should run "getIconName" method for "state" object', () => {
      const spy = spyOn((notify as any).state, 'getIconName');

      notify.getIconName();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#getClassName', () => {
    it('should run "getClassName" method for "state" object', () => {
      const spy = spyOn((notify as any).state, 'getClassName');

      notify.getClassName();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#isAutoClose', () => {
    it('should run "isAutoClose" method for "state" object', () => {
      const spy = spyOn((notify as any).state, 'isAutoClose');

      notify.isAutoClose();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('#isBroadcastEvent', () => {
    it('should return true if eventType is equal "broadcast"', () => {
      notifyI.event_type = 'broadcast';
      notify = NotifyFactory.create(notifyI);

      expect(notify.isBroadcastEvent()).toBeTruthy();
    });
  });

  describe('#isClaimEvent', () => {
    it('should return true if eventType is equal "claim"', () => {
      notifyI.event_type = 'claim';
      notify = NotifyFactory.create(notifyI);

      expect(notify.isClaimEvent()).toBeTruthy();
    });
  });

  describe('#isErrorEvent', () => {
    it('should return true if eventType is equal "error"', () => {
      notifyI.event_type = 'error';
      notify = NotifyFactory.create(notifyI);

      expect(notify.isErrorEvent()).toBeTruthy();
    });
  });
});
