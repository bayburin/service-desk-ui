import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { UnauthorizedPageComponent } from './unauthorized.page';
import { AuthService } from '@auth/auth.service';
import { StubAuthService } from '@auth/auth.service.stub';


describe('UnauthorizedComponent', () => {
  let component: UnauthorizedPageComponent;
  let fixture: ComponentFixture<UnauthorizedPageComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnauthorizedPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: AuthService, useClass: StubAuthService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizedPageComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should class AuthService#clearAuthData method', () => {
    spyOn(authService, 'clearAuthData');
    fixture.detectChanges();

    expect(authService.clearAuthData).toHaveBeenCalled();
  });

  describe('#authorize', () => {
    it('should call AuthService#authorize method', () => {
      spyOn(authService, 'authorize').and.callThrough();
      component.authorize();

      expect(authService.authorize).toHaveBeenCalled();
    });
  });
});
