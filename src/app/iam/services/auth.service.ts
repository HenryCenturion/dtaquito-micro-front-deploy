import { Injectable } from '@angular/core';
import {
  HttpClient, HttpErrorResponse,
} from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import {User} from "../../business/models/user.model";
import {UserService} from "../../business/services/user.service";
import {environment} from "../../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl+'/authentication/sign-in';
  private tokenKey = 'authToken';
  private userIdKey = 'userId';
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private router: Router, private http: HttpClient, private userService: UserService) { }

  register(user: any): Observable<any> {
    return this.userService.createUser(user).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400 || typeof error.error === 'string' && error.error.includes('User with this email already exists')) {
          return throwError(() => new Error('User with this email already exists'));
        }
        return throwError(() => new Error('An unknown error occurred'));
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    const body = { email: email, password: password };

    return this.http.post<User>(this.baseUrl, body).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.setUserId(response.id);
          this.currentUserSubject.next(response);
        }
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUserId(userId: number): void {
    localStorage.setItem(this.userIdKey, userId.toString());
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }


  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
