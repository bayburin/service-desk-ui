import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { UserFactory } from '@shared/factories/user.factory';
import { UserService } from '@shared/services/user/user.service';
import { User } from '@shared/models/user/user.model';
import { ApplicationPolicy } from './application.policy';

const user = UserFactory.create({ tn: 17_664 });

class StubUserService {
  user = new BehaviorSubject<User>(user);
}

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
