import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private translate: TranslateService) {
    this.initializeLanguage();
  }

  initializeLanguage() {
    // Verifica si estamos en un entorno de cliente (navegador)
    if (typeof window !== 'undefined') {
      const language = localStorage.getItem('language') || 'en';
      this.setLanguage(language);
    } else {
      // Si no estamos en el navegador, usa el idioma predeterminado
      this.setLanguage('en');
    }
  }

  setLanguage(language: string) {
    this.translate.use(language);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language); // Solo guarda el idioma si estamos en el cliente
    }
  }
}
