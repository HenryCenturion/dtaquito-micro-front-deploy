import { Injectable } from '@angular/core';
import { environment } from "../../../environment/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  getSubscriptionbyUserId(userId: string | null): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${this.baseUrl}/suscriptions?userId=${userId}`, { headers });
    }
  }

  updateSubscription(userId: string | null, newPlanType: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const params = new HttpParams()
        .set('userId', userId || '')
        .set('newPlanType', newPlanType);

      this.http.put(`${this.baseUrl}/suscriptions/upgrade/subscription`, {}, { headers, params, responseType: 'text' })
        .subscribe(
          (response: string) => {
            console.log('Respuesta de actualización:', response);

            // Extraer el enlace de pago de la respuesta en texto plano
            const match = response.match(/paymentLink=(https?:\/\/[^\s]+)/);
            if (match && match[1]) {
              const paymentLink = match[1];
              console.log('Enlace de pago extraído:', paymentLink);

              // Abrir la URL en una ventana emergente
              const paymentWindow = window.open(paymentLink, 'Payment', 'width=1200,height=800');
              if (paymentWindow) {
                const interval = setInterval(() => {
                  if (paymentWindow.closed) {
                    clearInterval(interval);
                    location.reload(); // Recargar la página al cerrar la ventana de pago
                  }
                }, 1000);
              }
            } else {
              console.error('No se pudo extraer el enlace de pago de la respuesta.');
            }
          },
          (error: any) => {
            console.error('Error al actualizar la suscripción:', error);
          }
        );
    } else {
      console.error('No se pudo acceder al localStorage.');
    }
  }

}
