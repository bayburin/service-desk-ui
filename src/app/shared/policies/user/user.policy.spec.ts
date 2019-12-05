import { TestBed } from '@angular/core/testing';

import { UserService } from '@shared/services/user/user.service';
import { StubUserService, user } from '@shared/services/user/user.service.stub';
import { UserPolicy } from './user.policy';

describe('UserPolicy', () => {
  let userPolicy: UserPolicy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useClass: StubUserService }]
    });

    userPolicy = TestBed.get(UserPolicy);
  });

  describe('#responsibleUserAccess', () => {
    describe('when user has "content_manager" role', () => {
      beforeEach(() => user.role.name = 'content_manager');

      it('should grant access', () => {
        expect(userPolicy.responsibleUserAccess()).toBeTruthy();
      });
    });

    describe('when user has "operator" role', () => {
      beforeEach(() => user.role.name = 'operator');

      it('should grant access', () => {
        expect(userPolicy.responsibleUserAccess()).toBeTruthy();
      });
    });

    describe('when user has "service_responsible" role', () => {
      beforeEach(() => user.role.name = 'service_responsible');

      it('should grant access', () => {
        expect(userPolicy.responsibleUserAccess()).toBeTruthy();
      });
    });

    describe('when user has another role', () => {
      beforeEach(() => user.role.name = 'guest');

      it('should deny access', () => {
        expect(userPolicy.responsibleUserAccess()).toBeFalsy();
      });
    });
  });
});
