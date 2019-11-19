import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ResponsibleUserDetailsComponent } from './responsible-user-details.component';
import { ResponsibleUserI } from '@interfaces/responsible-user.interface';
import { ResponsibleUserDetailsI } from '@interfaces/responsible_user_details.interface';

describe('ResponsibleUserDetailsComponent', () => {
  let component: ResponsibleUserDetailsComponent;
  let fixture: ComponentFixture<ResponsibleUserDetailsComponent>;
  const resopnsibleUsers: ResponsibleUserI[] = [
    { id: 1, tn: 17664, details: undefined } as ResponsibleUserI,
    { id: 2, tn: 12345, details: { full_name: 'Форточкина К.И.', phone: '12-34' } as ResponsibleUserDetailsI } as ResponsibleUserI
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [ResponsibleUserDetailsComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsibleUserDetailsComponent);
    component = fixture.componentInstance;
    component.label = 'Тестовое сообщение';
    component.users = resopnsibleUsers;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show label', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain('Тестовое сообщение');
  });

  it('should show user details', () => {
    expect(fixture.debugElement.nativeElement.textContent).toContain('Форточкина К.И.');
    expect(fixture.debugElement.nativeElement.textContent).toContain('тел. 12-34');
  });

  describe('when "details" attribute is empty', () => {
    beforeEach(() => {
      resopnsibleUsers.forEach(user => user.details = undefined);
      fixture.detectChanges();
    });

    it('should not show any data', () => {
      expect(fixture.debugElement.nativeElement.textContent).toEqual('');
    });
  });
});
