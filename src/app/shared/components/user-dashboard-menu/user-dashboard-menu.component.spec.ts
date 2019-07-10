import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardMenuComponent } from './user-dashboard-menu.component';

describe('UserDashboardMenuComponent', () => {
  let component: UserDashboardMenuComponent;
  let fixture: ComponentFixture<UserDashboardMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDashboardMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDashboardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
