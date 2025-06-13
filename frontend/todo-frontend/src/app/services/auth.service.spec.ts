import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, LoginRequest, RegisterRequest } from './auth.service';
import { environment } from '../../environments/environment';
import { PLATFORM_ID } from '@angular/core';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockAuthResponse = {
    token: 'test-token',
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser'
        }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const loginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    };

    service.login(loginRequest).subscribe(response => {
      expect(response).toEqual(mockAuthResponse);
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.getToken()).toBe('test-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockAuthResponse);
  });

  it('should register successfully', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    service.register(registerRequest).subscribe(response => {
      expect(response).toEqual(mockAuthResponse);
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.getToken()).toBe('test-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockAuthResponse);
  });

  it('should handle login error', () => {
    const loginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    service.login(loginRequest).subscribe({
      error: (error) => {
        expect(error.message).toBe('Invalid credentials');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should logout successfully', () => {
    // First login to set the current user
    service.login({ email: 'test@example.com', password: 'password123' }).subscribe();
    const loginReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    loginReq.flush(mockAuthResponse);

    // Then test logout
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getToken()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle auth error and logout', () => {
    // First login to set the current user
    service.login({ email: 'test@example.com', password: 'password123' }).subscribe();
    const loginReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    loginReq.flush(mockAuthResponse);

    const error = { status: 401 };
    expect(service.handleAuthError(error)).toBeTrue();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should restore user from localStorage on init', () => {
    localStorage.setItem('currentUser', JSON.stringify(mockAuthResponse));

    // Create a new instance of the service
    const newService = TestBed.inject(AuthService);

    expect(newService.isAuthenticated()).toBeTrue();
    expect(newService.getToken()).toBe('test-token');
  });
});
