import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  getUserById(id: string | null): Observable<any> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/users/${id}`, { headers });
    }
    return of([]);
  }

  updateUser(user: User): Observable<any> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.put(`${this.baseUrl}/users/${user.id}`, user, { headers });
    }
    return of(null);
  }
}
