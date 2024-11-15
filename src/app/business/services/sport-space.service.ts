import { Injectable } from '@angular/core';
import {environment} from "../../../environment/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SportSpaceService {

  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  getAllSportSpaces(): Observable<any> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.baseUrl}/sports/all`, { headers });
    }
    return of([]);
  }

  getSportSpacesByUserId(userId: string): Observable<any> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.baseUrl}/sports?userId=${userId}`, { headers }).pipe(
        catchError(error => {
          console.error('No existing sport spaces:', error);
          return of([]);
        })
      );
    }
    return of([]);
  }

  addSportSpace(sportSpace: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/sports/create/sport-spaces`, sportSpace, { headers });
  }

  updateSportSpace(sportSpace: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/sports/${sportSpace.id}`, sportSpace, { headers });
  }
}
