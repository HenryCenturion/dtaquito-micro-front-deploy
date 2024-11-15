import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { MatDrawer, MatDrawerContainer } from "@angular/material/sidenav";
import {NgClass, NgIf} from "@angular/common";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { FormsModule } from "@angular/forms";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import {ThemeService} from "../../../shared/services/theme.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../../iam/services/auth.service";
import {TranslationService} from "../../../shared/services/translation.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatDrawerContainer,
    MatDrawer,
    NgIf,
    MatButton,
    MatIcon,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    NgClass,
    TranslatePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  newPassword: string = '';
  originalUser: User | null = null;
  language: string = 'en';
  isDarkMode = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private themeService: ThemeService,
    private translationService: TranslationService) {}

  ngOnInit(): void {

    this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
      this.applyTheme();
    });

    this.language = localStorage.getItem('language') || 'en';

    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (data: User) => {
          this.user = { ...data };
          this.originalUser = { ...data };
        },
        (error: any) => {
          console.error('Error fetching user data', error);
        }
      );
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

  private getUserIdFromLocalStorage(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  getRoleDescription(roleType: string): string {
    switch (roleType) {
      case 'R':
        return 'Player';
      case 'P':
        return 'Owner';
      default:
        return 'Unknown Role';
    }
  }

  onSubmit(): void {
    if (this.user) {
      if (this.newPassword) {
        this.user.password = this.newPassword;
      }
      console.log(this.user);
      // this.userService.updateUser(this.user).subscribe(
      //   () => {
      //     location.reload();
      //   }
      // );
    }
  }

  isFormChanged(): boolean {
    if (!this.user || !this.originalUser) return false;
    return this.user.name !== this.originalUser.name || this.user.email !== this.originalUser.email || this.newPassword !== '';
  }

  isEmailValid(): boolean {
    if (!this.user || !this.user.email) {
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(this.user.email);
  }

  logout() {
    this.authService.logout();
  }
}
