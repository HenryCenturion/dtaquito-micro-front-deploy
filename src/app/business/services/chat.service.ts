import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { map } from 'rxjs/operators';
import {WebSocketService} from "../../shared/services/websocket.service";
import {environment} from "../../../environment/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserService} from "./user.service";

@Injectable()
export class ChatService {
  public messages: Subject<any>;

  constructor(wsService: WebSocketService,
              private http: HttpClient,
              private userService: UserService) {
    this.messages = <Subject<any>>wsService.connect(environment.chatUrl).pipe(
      map((response: MessageEvent): any => {
        try {
          let data = JSON.parse(response.data);
          return {
            author: data.userId,
            message: data.content
          };
        } catch (e) {
          console.error("Error parsing JSON: ", e, 'Datos recibidos:', response.data);
          return {
            author: "unknown",
            message: "Invalid message format"
          };
        }
      })
    );
  }

  sendMessage(roomId: number, content: string, userId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');
    const url = `http://4.156.218.229:8080/api/v1/chat/rooms/${roomId}/messages?userId=${userId}`;
    //const url = `http://localhost:8080/api/v1/chat/rooms/${roomId}/messages?userId=${userId}`;
    const body = { content: content };
    return this.http.post(url, body, { headers });
  }

  receiveMessages(): Observable<any> {
    return this.messages.asObservable();
  }
}
