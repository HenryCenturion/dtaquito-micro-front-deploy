import { Injectable } from '@angular/core';
import {environment} from "../../../environment/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getAllRooms(): Observable<any> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.baseUrl}/rooms/all`, { headers });
    }
    return of([]);
  }

  getRoomById(roomId: number): Observable<any> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.baseUrl}/rooms/${roomId}`, { headers });
    }
    return of([]);
  }

  getPlayerList(roomId: number): Observable<any> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.baseUrl}/player-lists/room/${roomId}`, { headers });
    }
    return of([]);
  }

  joinPlayerList(userId: number, roomId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.baseUrl}/player-lists/join?userId=${userId}&roomId=${roomId}`;
    return this.http.post(url, {}, { headers });
  }

  createRoom(room: any): Observable<any> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const { creatorId, sportSpaceId, day, openingDate, roomName } = room;
      const url = `${this.baseUrl}/rooms/create?creatorId=${creatorId}&sportSpaceId=${sportSpaceId}&day=${day}&openingDate=${openingDate}&roomName=${roomName}`;
      return this.http.post(url, {}, { headers });
    }
    return of([]);
  }

  getRoomChat(roomId: number): Observable<any> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`http://4.156.218.229:8080/api/v1/chat/rooms/${roomId}/messages`, { headers });
      //return this.http.get(`http://localhost:8080/api/v1/chat/rooms/${roomId}/messages`, { headers });
    }
    return of([]);
  }

  // sendMessage(roomId: number, message: string, userId: number): Observable<any> {
  //   if (typeof window !== 'undefined' && window.localStorage) {
  //     const token = localStorage.getItem('authToken');
  //     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //     const url = `https://dtaquito-backend.azurewebsites.net/api/v1/chat/rooms/${roomId}/messages?content=${encodeURIComponent(message)}&userId=${userId}`;
  //     return this.http.post(url, {}, { headers });
  //   }
  //   return of([]);
  // }
}
