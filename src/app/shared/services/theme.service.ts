import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject: BehaviorSubject<boolean>;

  isDarkMode$;

  constructor() {
    const darkThemeEnabled = this.isLocalStorageAvailable() && localStorage.getItem('darkTheme') === 'true';
    this.isDarkModeSubject = new BehaviorSubject<boolean>(darkThemeEnabled);
    this.isDarkMode$ = this.isDarkModeSubject.asObservable();
  }

  toggleDarkMode() {
    const currentDarkMode = this.isDarkModeSubject.value;
    const newDarkMode = !currentDarkMode;
    this.isDarkModeSubject.next(newDarkMode);

    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('darkTheme', newDarkMode.toString());
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && window.localStorage !== null;
    } catch (error) {
      return false;
    }
  }
}
