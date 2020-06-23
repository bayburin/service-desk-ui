import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { LogoutPageComponent } from './logout.page';
import { AuthService } from '@auth/auth.service';
import { StubAuthService } from '@auth/auth.service.stub';

describe('LogoutPageComponent', () => {
  let component: LogoutPageComponent;
  let fixture: ComponentFixture<LogoutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogoutPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: AuthService, useClass: StubAuthService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should class "unauthorize" method for AuthService', inject([AuthService], (authService: AuthService) => {
    spyOn(authService, 'unauthorize').and.returnValue(of({}));
    fixture.detectChanges();

    expect(authService.unauthorize).toHaveBeenCalled();
  }));
});
