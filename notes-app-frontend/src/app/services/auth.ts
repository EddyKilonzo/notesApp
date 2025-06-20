import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';


interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }
  /**
   * This method is used to load the stored user
   * @returns The stored user
   */

  private loadStoredUser(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
  /**
   * This method is used to login the user
   * @param loginRequest - The login request
   * @returns The login response
   */

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }
  /**
   * This method is used to signup the user
   * @param signupRequest - The signup request
   * @returns The signup response
   */
  signup(signupRequest: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, signupRequest)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }
  /**
   * This method is used to logout the user
   * @returns The user
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
  /**
   * This method is used to get the token
   * @returns The token
   */

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  /**
   * This method is used to check if the user is logged in
   * @returns The user
   */

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  /**
   * This method is used to get the current user
   * @returns The current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
