import { TestBed } from '@angular/core/testing';

import { UserService } from '@shared/services/user/user.service';
import { ApplicationPolicy } from './application.policy';
import { StubUserService, user } from '@shared/services/user/user.service.stub';

class TestPolicy extends ApplicationPolicy {
  testMethod() {}
}

describe('ApplicationPolicy', () => {
  let applicationPolicy: ApplicationPolicy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestPolicy,
        { provide: UserService, useClass: StubUserService }
      ]
    });

    applicationPolicy = TestBed.get(ApplicationPolicy);
  });

  it('should create instance', () => {
    expect(applicationPolicy).toBeTruthy();
  });

  it('should set user data if "user" attribute', () => {
    expect(applicationPolicy.user).toEqual(user);
  });

  describe('#authorize', () => {
    let testPolicy: TestPolicy;
    const object = { foo: 'bar' };

    beforeEach(() => {
      testPolicy = TestBed.get(TestPolicy);
    });

    it('should set "object" attribute', () => {
      testPolicy.authorize(object, 'testMethod');

      expect(testPolicy.object).toEqual(object);
    });

    it('should call method with specified name', () => {
      spyOn(testPolicy, 'testMethod');
      testPolicy.authorize(object, 'testMethod');

      expect(testPolicy.testMethod).toHaveBeenCalled();
    });
  });
});
