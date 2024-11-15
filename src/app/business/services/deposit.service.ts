import { Injectable } from '@angular/core';
import {environment} from "../../../environment/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  createDeposit(amount: number): Observable<string> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Aquí se hace la solicitud con responseType='text' para manejar la respuesta como texto
      return this.http.post(`${this.baseUrl}/deposit/create-deposit?amount=${amount}`, {}, { headers, responseType: 'text' });
    }
    throw new Error('No se pudo acceder al localStorage.');
  }

}
