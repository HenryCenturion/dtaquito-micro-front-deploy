import {Component, OnInit} from '@angular/core';
import {MatFormField} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {ThemeService} from "../../../shared/services/theme.service";
import {TranslationService} from "../../../shared/services/translation.service";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    NgIf,
    MatButton,
    RouterLink,
    MatIcon,
    NgClass,
    TranslatePipe
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl ('', [Validators.required]);
  language: string = 'en';
  isDarkMode = false;

  constructor(private authService: AuthService,
              private router: Router,
              private themeService: ThemeService,
              private translationService: TranslationService) {
  }

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
      this.applyTheme();
    });
    if (typeof localStorage !== 'undefined') {
      this.language = localStorage.getItem('language') || 'en';
    } else {
      this.language = 'en';
    }
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  changeLanguage(): void {
    this.language = this.language === 'en' ? 'es' : 'en';
    localStorage.setItem('language', this.language);
    this.translationService.setLanguage(this.language);
  }

  applyTheme(): void {
    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      if (typeof document !== 'undefined') {
        if (isDarkMode) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }
    });
  }

  onSubmit() {
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      const email = this.emailFormControl.value ?? '';
      const password = this.passwordFormControl.value ?? '';
      this.authService.login(email, password).subscribe(() => {
        this.router.navigate(['/sport-spaces']);
      });
    }
  }

}
