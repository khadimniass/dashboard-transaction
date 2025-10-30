import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, UserRole, LoginCredentials, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private isBrowser: boolean;

  // Mock users for demonstration
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@dashboard.com',
      name: 'Administrateur',
      role: UserRole.ADMIN,
    },
    {
      id: '2',
      email: 'user@dashboard.com',
      name: 'Utilisateur Simple',
      role: UserRole.USER,
    },
  ];

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    let storedUser = null;
    if (this.isBrowser) {
      const storedUserString = localStorage.getItem('currentUser');
      storedUser = storedUserString ? JSON.parse(storedUserString) : null;
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock authentication - In production, this would call a real API
    const user = this.mockUsers.find((u) => u.email === credentials.email);

    if (!user) {
      return throwError(() => new Error('Email ou mot de passe incorrect')).pipe(delay(500));
    }

    // Mock password validation (accept any password for demo)
    // In production: validate against hashed password
    const mockToken = 'mock-jwt-token-' + user.id;

    const authResponse: AuthResponse = {
      user,
      token: mockToken,
    };

    // Store user in localStorage (only in browser)
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', mockToken);
    }
    this.currentUserSubject.next(user);

    return of(authResponse).pipe(delay(800));
  }

  logout(): void {
    // Remove user from localStorage (only in browser)
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === UserRole.ADMIN;
  }

  isUser(): boolean {
    return this.currentUserValue?.role === UserRole.USER;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserValue?.role === role;
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }
}
